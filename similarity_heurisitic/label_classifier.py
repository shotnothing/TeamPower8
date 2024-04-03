+from transformers import pipeline
import pandas as pd
import json
import os
from supabase import create_client, Client, ClientOptions
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import seaborn as sns
from rake_nltk import Rake
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
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


pd.set_option('display.max_columns', None)
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key,options=ClientOptions().replace(schema="data"))
# need to change the table!
response = supabase.table("cleaned_combined_tables").select("*").execute()
df = pd.DataFrame(response.data)

df1 = df.fillna('missing value')

classifier = pipeline("zero-shot-classification")

def classify(df, labels, threshold=0):
    def _get_labels(text):
        result = classifier(text, labels)
        labels_above_threshold = [
            label for label, score in zip(result['labels'], result['scores']) 
            if score > threshold]
        return labels_above_threshold if labels_above_threshold else None

    # df['labels'] = df['description'].apply(_get_labels)

    # do it with for loop
    from tqdm import tqdm
    for index, row in tqdm(df.iterrows()):
        df.at[index, 'labels'] = _get_labels(row['description'])

    return df

df1 = classify(df1, label_set1)
df1.head()
