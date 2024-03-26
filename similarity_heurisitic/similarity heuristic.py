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


pd.set_option('display.max_columns', None)
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key,options=ClientOptions().replace(schema="data"))
response = supabase.table("cleaned_combined_tables").select("*").execute()
df = pd.DataFrame(response.data)

df = df.fillna('missing value')

# extract only require columns
df1 = df[['product_name','description','category','subcategory']]

def extract_keywords():
    df1['keywords'] = ''

    for index, row in df1.iterrows():
        description = row['description']
  
        #instantiating Rake by default it uses English stopwords from NLTK and discards all punctuation chars
        r = Rake()
    
        #extract words by passing the text
        r.extract_keywords_from_text(description)
    
        #get the dictionary with key words and their scores
        keyword_dict_scores = r.get_word_degrees()
    
        #assign keywords to new columns
        row['keywords'] = list(keyword_dict_scores.keys())

extract_keywords()

def create_soup(x):
    # combine all columns together
    return ' '.join(x['keywords']) + ' ' + ' '.join(x['product_name']) + ' ' + x['category'] + ' ' + ' '.join(x['subcategory'])


df1['soup'] = df1.apply(create_soup, axis=1)
df1.set_index('product_name', inplace = True)

count = CountVectorizer()
count_matrix = count.fit_transform(df1['soup'])

#create a Series for product names so they are associated to an ordered numerical list, we will use this later to match index
indices = pd.Series(df1.index)

cosine_sim = cosine_similarity(count_matrix, count_matrix)

def recommendations(name,n = 10,cosine_sim = cosine_sim):
    recommended_products = []
    
    #get index of the product that matches the product name
    idx = indices[indices == name].index[0]
    
    #find highest cosine_sim this name shares with other names extracted earlier and save it in a Series
    score_series = pd.Series(cosine_sim[idx]).sort_values(ascending = False)
    
    #get indexes of the 'n' most similar products
    top_n_indexes = list(score_series.iloc[1:n+1].index)
    #print(top_n_indexes)
    
    #populating the list with titles of n matching products
    for i in top_n_indexes:
        recommended_products.append(list(df1.index)[i])
    return recommended_products

product = 'skyhelix sentosa'

recommendations(product)

def find_mountfaber_products(df):
    mountfaber_product = df[df["company"] == "mount faber leisure group"]
    mountfaber_product["similar_products"] = df['product_name'].apply(recommendations)
    return mountfaber_product.to_dict('records')


mount_faber_similar_product = []

mount_faber_similar_product = find_mountfaber_products(df)

supabase: Client = create_client(url, key,options=ClientOptions().replace(schema="data"))
data, count = supabase.table("mount_faber_similar_products").insert(mount_faber_similar_product).execute()
