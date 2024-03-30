from transformers import pipeline
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


classifier = pipeline("zero-shot-classification")

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
response = supabase.table("cleaned_combined_tables").select("*").execute()
df = pd.DataFrame(response.data)

df1 = df.fillna('missing value')

classifier = pipeline("zero-shot-classification")

def zero_shot_classify_sequences(dataframe, candidate_labels, threshold=0.8):
    for i in range(len(df1)):
          texts = df1.iloc[i]["description"]
          results = classifier(texts, candidate_labels, multi_label=True)
          final_results = []
          labels = results["labels"]
          scores = results['scores']
          for label, score in zip(labels, scores):
              if score > threshold:
                  final_results.append(label)
    dataframe['label'] = final_results
    return dataframe


zero_shot_classify_sequences(df1, label_set1)


