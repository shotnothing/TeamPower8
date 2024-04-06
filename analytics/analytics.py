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
    # Initialization
    url: str = os.environ.get("SUPABASE_URL") #TODO: move to docker-compose
    key: str = os.environ.get("SUPABASE_KEY")

    # Load data from Supabase
    supabase: sb.Client = sb.create_client(
        url, key, 
        options = sb.ClientOptions().replace(schema="scraper")
    )

    response = supabase \
        .table('cleaned') \
        .select('*') \
        .execute()
    
    df = pd.DataFrame(response.data)

    logger.info(f'Retrieved {len(df)} rows from scraper.cleaned')


    # Generate label membership
    lm = LabelMembershipPipeline(
        device = 0 if torch.cuda.is_available() else -1
    )

    # create dataframe with shape of (n_samples, n_labels)
    label_set = list(set(LABEL_SET_1 + LABEL_SET_2))
    label_df = pd.DataFrame(
        np.zeros((len(df), len(label_set))),
        columns = label_set
    )
    for i, row in tqdm(df.iterrows()):
        label_membership = lm.get_label_membership(
            row['description'], label_set
        )
        label_df.loc[i, label_membership['labels']] = label_membership['scores']

    try:
        label_df.to_csv('label_membership.csv')
    except Exception as e:
        logger.error(f'Error saving label membership: {e}')


run()
