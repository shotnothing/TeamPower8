import logging
logging.basicConfig(level = logging.INFO)
logger = logging.getLogger(__name__)

from transformers import pipeline
import pandas as pd
import numpy as np
import supabase as sb
import os
import torch
from tqdm import tqdm

from label_membership import *
from similarity_scoring import *

def run():
    ''' Runs the analytics pipeline.'''
    # Make export directory if it doesn't exist
    if not os.path.exists('./analytics/export'):
        os.makedirs('./analytics/export')

    # Run label membership
    if not os.path.exists('./analytics/export/label_membership.csv'):
        logger.info('Running label membership')
        df = run_fetch_supabase()
        label_df = run_label_membership(df)
        save_csv(label_df, './analytics/export/label_membership.csv')
    else:
        logger.info('Using existing label_membership.csv')
        label_df = load_csv('./analytics/export/label_membership.csv')

    # Run similarity scoring
    similarity_matrix_dfs = {}
    for distance_metric_name, distance_metric in SimilarityScoringPipeline \
                                                    .get_distance_metrics() \
                                                    .items():
        filepath = f'./analytics/export/similarity_matrix_{distance_metric_name}.csv'
        if not os.path.exists(filepath):
            logger.info(f'Running similarity scoring for {distance_metric_name}')
            similarity_matrix_df = run_similarity_scoring(
                label_df, 
                similarity_heuristic = distance_metric)
            save_csv(similarity_matrix_df, filepath)
        else:
            logger.info(f'Using existing similarity_matrix_{distance_metric_name}.csv')
            similarity_matrix_df = load_csv(filepath)
        similarity_matrix_dfs[distance_metric_name] = similarity_matrix_df

    

    logger.info('Done creating similarity matrices. Upload these to Supabase.')

def run_fetch_supabase():
    ''' Fetches the cleaned scraped from Supabase and returns a DataFrame.

    Returns:
        pd.DataFrame: DataFrame containing the scraped data.
    '''
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    supabase: sb.Client = sb.create_client(
        url, key, 
        options = sb.ClientOptions().replace(schema="scraper")
    )

    response = supabase \
        .table('cleaned') \
        .select('*') \
        .execute()
    
    if not response:
        logger.error(f'Error fetching from scraper.cleaned: {response.error}')
        raise Exception(response.error)

    df = pd.DataFrame(response.data)
    logger.info(f'Retrieved {len(df)} rows from scraper.cleaned')

    return df

def run_label_membership(df):
    ''' Runs the label membership pipeline on the DataFrame.

    Args:
        df (pd.DataFrame): DataFrame containing the scraped data.

    Returns:
        pd.DataFrame: DataFrame containing the label membership scores.
    '''
    lm = LabelMembershipPipeline(
        device = 0 if torch.cuda.is_available() else -1
    )

    label_set = list(set(LABEL_SET_1+LABEL_SET_2))
    label_df = pd.DataFrame(
        np.zeros((len(df), len(label_set))),
        columns = label_set
    )
    label_df['title'] = df['title']
    label_df['id'] = df['id']

    for _, row in tqdm(df.iterrows()):
        label_membership = lm.get_label_membership(
            row['description'], label_set
        )
        label_df.loc[
            int(row['id']), 
            label_membership['labels']
        ] = label_membership['scores']

    return label_df

def run_similarity_scoring(label_df, similarity_heuristic = None, mode = 'matrix'):
    ''' Runs the similarity scoring pipeline on the DataFrame.

    Args:
        label_df (pd.DataFrame): DataFrame containing the label membership scores.
        similarity_heuristic (function): Function to use as the similarity heuristic.
        mode (str): Mode to return the similarity scoring in. Can be 'pairwise' or 'matrix'.

    Returns:
        pd.DataFrame: DataFrame containing the similarity scores.
    '''
    ss = SimilarityScoringPipeline()
    similarity_matrix, similarity_pairwise_df = ss.get_similarity_matrix(
        label_df, 
        similarity_heuristic = similarity_heuristic
    )

    if mode == 'pairwise':
        return similarity_pairwise_df
    elif mode == 'matrix':
        similarity_matrix_df = pd.DataFrame(similarity_matrix)
        similarity_matrix_df.columns = label_df['id']
        similarity_matrix_df.insert(0, 'id', label_df['id'])
        return similarity_matrix_df
    else:
        raise ValueError(f'Invalid mode: {mode}')

def save_csv(df, filename):
    ''' Saves the DataFrame to a CSV file.
    
    Args:
        df (pd.DataFrame): DataFrame to save.
        filename (str): Filename to save to.
    '''
    try:
        df.to_csv(filename, index=False)
    except Exception as e:
        logger.error(f'Error saving {filename}: {e}')

def load_csv(filename):
    ''' Loads a DataFrame from a CSV file.
    
    Args:
        filename (str): Filename to load from.
        
    Returns:
        pd.DataFrame: DataFrame loaded from the CSV file.
    '''
    try:
        return pd.read_csv(filename)
    except Exception as e:
        logger.error(f'Error loading {filename}: {e}')

if __name__ == '__main__':
    run()
