import requests_html
from requests_html import HTMLSession
from bs4 import BeautifulSoup
from datetime import date,timedelta
from datetime import date
from supabase import create_client, Client, ClientOptions
from dotenv import load_dotenv
import os

def get_attractions_links(session: requests_html.HTMLSession, url: str) -> dict[str,str]:
    r = session.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    product_item_ele = soup.find_all("div",class_="product-item")
    result = {}
    for e in product_item_ele:
        info_e = e.find("div",class_="title-wrap").find("a")
        p_title = info_e.text
        link = info_e["href"]
        result[p_title] = link
    return result

def extract_product_info(session: requests_html.HTMLSession,listing_links):
    result = []
    for p_title,link in listing_links.items():
        r = session.get(link)
        soup = BeautifulSoup(r.text, "html.parser")
        #image
        image_url_precleaned = soup.find("div",class_="mainImage")["style"]
        start_index = image_url_precleaned.index("https")
        end_index = image_url_precleaned.index(")")
        p_image = image_url_precleaned[start_index:end_index+1]
        #price
        p_price = soup.find("div",class_="regular-price").find("span",class_="quantity").text
        #description
        p_description = "".join([t for t in soup.find("div",class_="readMoreWrap").stripped_strings])
        #"".join([t for t in soup.find("ul",class_="highLightList").stripped_strings])
        result.append({
            "company": "megaadventure",
            "product_name": p_title,
            "description": p_description,
            "price": p_price,
            "source_link": link,
            "remarks": None,
            "image": p_image,
            "category": None,
            "subcategory": None,
            "scrapped_at": date.today()
        })
    return result


s = HTMLSession()
listing_links = get_attractions_links(s,"https://store.megaadventure.com/")
data_collected= extract_product_info(s,listing_links)

#Remove duplicates
shifted_lst = []
encountered_lst = set()
for d in data_collected:
    p_name = d["product_name"]
    if p_name in encountered_lst:
        continue
    else:
        shifted_lst.append(d)
        encountered_lst.add(p_name)
print(f"Num Products before removing duplicates: {len(data_collected)}")
print(f"Num Products after removing duplicates: {len(shifted_lst)}")
data_collected = shifted_lst

#Further cleaning
for d in data_collected:
    d["scrapped_at"] = d["scrapped_at"].isoformat()
    d["price"] = float("".join([c for c in d["price"] if c.isdigit() or c == "."]))
# Inserting data into Supabase
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key,options=ClientOptions().replace(schema="data"))
data, count = supabase.table("auto_scraped_attractions").insert(data_collected).execute()