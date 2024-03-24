from bs4 import BeautifulSoup
import requests
import pandas as pd
from datetime import date
from supabase import create_client, Client
from dotenv import load_dotenv
import os

url = "https://www.skyparksentosa.com/activities"

page = requests.get(url)

soup = BeautifulSoup(page.text, 'html.parser')

#print(soup)


products = soup.find_all('div', class_='item')

#Retrive product link
product_links = []
for product in products:
    link_tag = product.find('a', href=True)
    if link_tag:
        link = "https://www.skyparksentosa.com"+ link_tag['href'] #https://www.skyparksentosa.com/activities/bungy
        product_links.append(link)

print(product_links)

#retrieving 10 items from each product link
results = []
for product in product_links:
    page_a = requests.get(product)
    soup = BeautifulSoup(page_a.text, 'html.parser')
    dict = {}
    dict['company'] = 'skyparksentosa'

    #title = product.find_all('a', href=lambda href: href and href.startswith('/activities/'))
    title_element = soup.find('h1', class_='Heading__StyledHeading-sc-1ikhowk-0 jCdENO')
    title = title_element.text if title_element else None
    dict['product_name'] = title

    description = soup.find('p').text
    dict['description'] = description

    price_div = soup.find('div', class_='price-bold')
    price_text = price_div.text.replace('SGD\xa0', '')
    dict['price']= price_text

    dict['source_link'] = product
    dict['remarks'] = 'Free Perks'

    image_source = soup.find('img')['srcset']
    dict['image'] = image_source

    dict['category'] = 'Outdoor Activity'

    dict['subcategory'] = 'Thrill'

    dict['scrapped_at'] = date.today().isoformat()

    results.append(dict)

print(results)

# Inserting data into Supabase
load_dotenv()
url = os.environ.get("supabaseUrl")
key = os.environ.get("supabaseKey")
supabase: Client = create_client(url, key)
supabase.table("sc_products").insert(results).execute()


#company
#product_name -
#description - in the <p> in div class = <div class="Content__StyledContent-sc-usalwn-0 CorNn"><h1 class="Heading__StyledHeading-sc-1ikhowk-0 jCdENO">Set your heart racing</h1><p>Stand 47m above some of the most stunning scenery in Singapore! Take in the view across the ocean, take a deep breath...then take the plunge. This exhilarating, life-changing experience delivers the ultimate rush with all the experience of expertise of the Skypark Sentosa crew in every single jump. Whether you’re a first-time jumper or a seasoned thrill-seeker, we’ll make sure you get the most out of the experience.<br><br></p></div>
#price - <div class="price-bold">SGD&nbsp;99</div>
#source_link -
#remarks - list under <ul class="Features__StyledFeatures-sc-16vlr6y-0 ggvyOg"><li><div><div class="Icon__StyledIcon-sc-1bbqg23-0 gnMEEu icon "><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0a1 1 0 0 1 1 1v3h4a1 1 0 1 1 0 2h-4v5h1.5a4.5 4.5 0 0 1 0 9H13v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h5v-5H9.5a4.5 4.5 0 1 1 0-9H11V1a1 1 0 0 1 1-1Zm1 18h1.5a2.5 2.5 0 0 0 0-5H13v5Zm-2-7V6H9.5a2.5 2.5 0 0 0 0 5H11Z" fill="currentColor" fill-rule="evenodd"></path></svg></div><span>Free access to Skybridge</span></div></li><li><div><div class="Icon__StyledIcon-sc-1bbqg23-0 gnMEEu icon "><svg width="24" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M21 0a3 3 0 0 1 3 3v4l-.001.017L24 15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h18Zm1 8H2v7a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8Zm-1-6H3a1 1 0 0 0-1 1v3h20V3a1 1 0 0 0-1-1Z" fill-rule="evenodd"></path></svg></div><span>Skypark Global Membership - 20% off worldwide</span></div></li><li><div><div class="Icon__StyledIcon-sc-1bbqg23-0 gnMEEu icon "><svg xmlns="http://www.w3.org/2000/svg" width="25" height="24"><path fill="currentColor" fill-rule="evenodd" d="M14.5 4a3 3 0 0 1 3 3l-.001 3.057 5.42-3.87A1 1 0 0 1 24.5 7v10a1 1 0 0 1-1.581.814l-5.42-3.872L17.5 17a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h11zm0 2h-11a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm8 2.943L18.22 12l4.28 3.057V8.943z"></path></svg></div><span>Bungy Video</span></div><span class="extra-text">(Package available for purchase)</span></li></ul>
#image (import base64)
#category - NA
#subcategory - NA
#scrapped_at

