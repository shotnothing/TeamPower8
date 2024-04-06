def main():
    from transformers import pipeline
    import os
    from supabase import create_client, Client, ClientOptions
    from dotenv import load_dotenv
    import pandas as pd
    import numpy as np
    import nltk
    from parallel_pandas import ParallelPandas
    """
    Note: parallel_pandas allow for parallel computing using Pandas. Polars package is probably superior but that will take some time to
    learn. We will user parallel_pandas because it is user friendly to pandas users.
    
    See: 
    https://towardsdatascience.com/easily-parallelize-your-calculations-in-pandas-with-parallel-pandas-dc194b82d82f
    https://pypi.org/project/parallel-pandas/
    """
    #Typical macbooks have only 8 cpus I think. I do not recommend using all 8 unless you want your comp to freeze.
    ParallelPandas.initialize(n_cpu=6, split_factor=4, disable_pr_bar=False)

    """
    from tqdm import tqdm
    import seaborn as sns
    from rake_nltk import Rake
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.feature_extraction.text import CountVectorizer
    from ast import literal_eval
    from sklearn.feature_extraction.text import TfidfVectorizer
    import json
    """
    nltk.download('stopwords')
    nltk.download('punkt')


    label_set1 = ["Landmarks", "Nature","Culture","Wildlife","Entertainment", "Museums","Food","Adventure","Experience","History"]

    label_set2 = ["Outdoor sports","Theme parks","Arts", "Tradition", "Heritage", "Food", "Educational", "Scenic",
                  "Games", "Workshop","Shows","Explore","Disovery", "Relaxing","Adventure","Thrill", "Marine Life", "Animals", "Galleries", "Icons"]

    label_set3 = ["Monument", "Statue", "Historic site", "Forest", "Mountains", "Beaches", "Festivals", "Traditions", "Customs", "Birds", "Mammals", "Reptiles",
                  "Concerts", "Theater", "Movies", "Artifacts", "Exhibits", "Science", "Cuisine", "Restaurants", "Street Food", "Hiking", "Rafting", "Skydiving",
                  "Workshops", "Tours", "Immersive", "Ancient civilizations", "Wars", "Archaeology", "Hiking", "Cycling", "Climbing", "Roller coasters", "Water slides", "Theme zones",
                  "Painting", "Sculpture", "Photography", "UNESCO sites", "Ancestral homes", "Cultural landmarks", "Workshops", "Lectures", "Classes",
                  "Landscapes", "Views", "Vistas", "Board games", "Video games", "VR", "DIY", "Craft-making", "Skill-building", "Performances", "Exhibitions", "Demonstrations",
                  "Expeditions", "Adventures","Discoveries", "Spa", "Meditation", "Yoga", "Extreme sports", "Adrenaline rushes", "Daredevil experiences",
                  "Coral reefs", "Marine mammals", "Underwater ecosystems", "Wildlife sanctuaries", "Zoos", "Safaris", "Art galleries", "Photography galleries", "Exhibitions",
                  "Landmarks", "Monuments", "Famous buildings", "Beaches", "Coastal towns", "Seafood", "Rides", "Attractions", "Fun zones", "Theater", "Dance", "Opera"]

    label_sets_that_we_are_using = [label_set1,label_set2]

    pd.set_option('display.max_columns', None)
    load_dotenv("../.env")
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key,options=ClientOptions().replace(schema="data"))
    # need to change the table!
    response = supabase.table("cleaned_combined_tables").select("*").execute()
    df = pd.DataFrame(response.data).fillna('missing value')

    classifier = pipeline("zero-shot-classification")

    def get_label_scores(text:str,labels_lst:list,classifier) -> np.ndarray:
        """
        Takes a description tet and outputs a np.ndarray of scores for each label in the labels_lst base on the label's
        association with the description.
        """
        result = classifier(text, labels_lst)
        get_label_scores.counter +=1
        print(f"function called for the {get_label_scores.counter}th time")
        return np.array(result['scores'])

    def calculate_distance(vector_1:np.ndarray, vector_2:np.ndarray,distance_metric:str) -> float:
        """
        Gets 2 vectors of the same length and apply a distance_metric to calculate the distance. The smaller the distance
        of score vectors of 2 attractions, the more similar they are to each other.

        distance_metric can be any of the following: "L1_Norm", "L2_Norm", "Cosine_Distance"
        """
        v = vector_1 - vector_2
        if distance_metric == "L1_Norm":
            return np.linalg.norm(v,ord=1)
        elif distance_metric == "L2_Norm":
            return np.linalg.norm(v, ord=2)
        elif distance_metric == "Cosine_Distance":
            numerator = (vector_1 *vector_2).sum()
            denominator = np.linalg.norm(vector_1,ord=2) * np.linalg.norm(vector_2,ord=2)
            return numerator/denominator

        else:
            raise Exception("Unacceptable distance metric. Do better")

    def calculate_distance_from_row(row:pd.Series,vector_1_cn:str,vector_2_cn:str,distance_metric:str) -> float:
        vector_1 = row[vector_1_cn]
        vector_2 = row[vector_2_cn]
        return calculate_distance(vector_1,vector_2_cn,distance_metric)

    # Get label scores
    for labels_lst in label_sets_that_we_are_using:
        k = len(labels_lst)
        df[f"scores_for_{k}_labels"] = df["description"].p_apply(get_label_scores, labels_lst=labels_lst,classifier=classifier)

    # Get similarity scores

        # First get the pair_wise dataframe , where each row represents a pair of attractions, and their scores.
        # For 3 labels_lst, we should have 2 product_ids, 3*2 vector scores per row. Thus, we will have 8 columns,
        # with 6 of the columns having numpy arrays as values.
        # The number of rows is C(n,2)
    scores_col_names = [f"scores_for_{len(label_lst)}_labels" for label_lst in [label_set1]]
    column_names_of_interest = scores_col_names + ["product_id"]
    df_subset = df[column_names_of_interest]
    pair_wise_df = df_subset.merge(df_subset,how="cross",suffixes = ["_x","_y"])
    pair_wise_df = pair_wise_df[pair_wise_df["product_id_x"] < pair_wise_df["product_id_y"]]

        # Calculating scores is now just a matter of apply a function to each row
        # We will end up with number of dataframes = number of distance metrics * number score sets = 3*3 = 9
    for label_lst in label_sets_that_we_are_using: #[label_set1, label_set2, label_set3]
        k = len(label_lst)
        score_col = f"scores_for_{k}_labels"
        for distance_metric in ["L1_Norm","L2_Norm","Cosine_Distance"]:
            new_col_name = f"{distance_metric}_for_{k}_labels"
            product_A_score_colname = score_col + "_x"
            product_B_score_colname = score_col + "_y"
            pair_wise_df[new_col_name] = pair_wise_df.p_apply(calculate_distance_from_row,
                                                              axis=1,
                                                              vector_1_cn=product_A_score_colname,
                                                              vector_2_cn=product_B_score_colname,
                                                              distance_metric=distance_metric
                                                              )
    # Dropping scores cause we don't need them anymore.
    columns_to_drop_x = [f"scores_for_{k}_labels_x" for label_lst in label_sets_that_we_are_using ]
    columns_to_drop_y = [f"scores_for_{k}_labels_y" for label_lst in label_sets_that_we_are_using ]
    columns_to_drop = columns_to_drop_x + columns_to_drop_y
    df_pair_wise_with_similarity_scores = pair_wise_df.drop(columns=columns_to_drop)

    # Upload df to supabase
    try:
        # Download csv because if upload fail, we will have to rerun the entire script again, cry :(
        df_pair_wise_with_similarity_scores.to_csv("product_pairwise_similarity_scores")
        data_collected = df_pair_wise_with_similarity_scores.to_dict('records')
        data, count = supabase.table("attractions_pairwise_similarity_scores").insert(data_collected).execute()

    except:
        data_collected = df_pair_wise_with_similarity_scores.to_dict('records')
        data, count = supabase.table("attractions_pairwise_similarity_scores").insert(data_collected).execute()

if __name__ == "__main__":
    main()

