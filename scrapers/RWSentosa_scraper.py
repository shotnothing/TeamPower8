#NOTE: Can consider scraping events as well. Can ask client.
    # https://www.rwsentosa.com/en/events
#NOTE: There are duplicates inside the resulting. Due to different timings of the same event. Need to edit later
#Note: Special Experience: Royal albatross needs to be entered manually. https://www.rwsentosa.com/en/special-experience/royal-albatross
#Note: need to use selenium to get the attraction data

import requests
import requests_html
#from selenium import webdriver
#from selenium.webdriver.chrome.service import Service
#from webdriver_manager.chrome import ChromeDriverManager
from requests_html import HTMLSession
from bs4 import BeautifulSoup
from datetime import date,timedelta
import pandas as pd

s = HTMLSession()
def get_promotion_category_links(session: requests_html.HTMLSession,
                                 promotions_url: str) -> dict[str,str]:
    result = {}
    r = session.get(promotions_url)
    soup = BeautifulSoup(r.text, "html.parser")
    listings = soup.find_all("div", class_="listing-card__content")
    for e in listings:
        category = e.find("h3",class_="listing-card__title").text
        link = f'https://www.rwsentosa.com{e.find("a",class_="link-normal listing-card__link")["href"]}'
        result[category] = link
    return result

def get_promotions_listing(session: requests_html.HTMLSession,
                           promotion_category_links: dict[str,str],
                           items_unable_to_scrape: list) -> list:
    result = []
    for category,link in promotion_category_links.items():
        r = session.get(link)
        soup = BeautifulSoup(r.text, "html.parser")
        try:
            promotions = soup.find("section",class_="offers-listing component-wrapper container").find_all("div",class_="listing-card__content")
            for p in promotions:
                age_group = None
                type_of_listing = "Promotion"
                p_title = p.find("h3",class_="listing-card__title").text
                p_price = p.find("span",class_="listing-card__price-value").text
                result.append({
                    "product": p_title,
                    "price": p_price,
                    "age_group": age_group,
                    "category": type_of_listing,
                    "sub_category": category,
                    "source": link
                })
                print(f"Successful Scrape: {p_title}")

        except AttributeError as e:
            items_unable_to_scrape.append([category,link])
            print(f"Unable to get prices from '{category}' category. Link used:\n{link}")

    return result

def get_SEA_VIP_listing(session: requests_html.HTMLSession,
                        SEA_VIP_url: str,
                        items_unable_to_scrape: list) -> list:
    result = []
    r = session.get(SEA_VIP_url)
    soup = BeautifulSoup(r.text,"html.parser")
    try:
        card_listings = soup.find("section",class_="offers-listing component-wrapper container").find_all("section",class_="listing-card--left")
        for cl in card_listings:
            age_group = None
            category = None
            type_of_listing = "VIP Experience"
            p_title = cl.find("div",class_="listing-card__content-descriptive").find("h3",class_="listing-card__title").text
            p_price = cl.find("span",class_="listing-card__price-value").text
            result.append({
                "product":p_title,
                "price":p_price,
                "age_group":age_group,
                "category":type_of_listing,
                "sub_category":category,
                "source":SEA_VIP_url
            })
            print(f"Successful Scrape: {p_title}")
    except:
        print(f"Unable to scrape SEA VIP Experience data. Link used:\n{SEA_VIP_url}")
        items_unable_to_scrape.append(["SEA_VIP_Experience",SEA_VIP_url])
    return result

def get_deep_dive_category_links(session: requests_html.HTMLSession,
                                 deep_dive_url: str) -> dict[str,str]:
    result = {}
    r = session.get(deep_dive_url)
    soup = BeautifulSoup(r.text, "html.parser")
    listings = soup.find("section",class_="vertical-listing component-wrapper container").find_all("section", class_="listing-card--right")
    for e in listings:
        listing_card_content = e.find("div",class_="listing-card__content")
        category = listing_card_content.find("h3",class_="listing-card__title").text
        link_suffix = listing_card_content.find("a",class_="listing-card__link")["href"]
        link = f'https://www.rwsentosa.com{link_suffix}'
        result[category] = link
        print(category, " ",link)
    return result

def get_deep_dive_listings(session: requests_html.HTMLSession,
                           deep_dive_category_links: dict[str,str],
                           items_unable_to_scrape: list) -> list:
    result = []
    for category, link in promotion_category_links.items():
        r = session.get(link)
        soup = BeautifulSoup(r.text, "html.parser")
        try:
            category_listings = soup.find("section",class_="offers-listing").find_all("section",class_="listing-card")
            for cl in category_listings:
                age_group = None
                type_of_listing = "Deep Dive"
                p_title = cl.find("h3",class_="listing-card__title").text
                p_price =cl.find("span",class_="listing-card__price-value").text
                result.append({
                    "product": p_title,
                    "price": p_price,
                    "age_group": age_group,
                    "category": type_of_listing,
                    "sub_category": category,
                    "source": link
                })
                print(f"Successful Scrape: {p_title}")
        except AttributeError as e:
            items_unable_to_scrape.append([category, link])
            print(f"Unable to get prices from '{category}' category. Link used:\n{link}")

    return result

def get_attraction_links(session: requests_html.HTMLSession,
                            RWS_Attraction_url: str) -> dict[str,str]:
    def get_link_from_attraction(attraction_element):
        first_link = f'https://www.rwsentosa.com{attraction_element.find("a", class_="listing-card__image-link")["href"]}'
        r = session.get(first_link)
        soup = BeautifulSoup(r.text, "html.parser")
        lst = soup.find("div",class_="product-card__wrapper").find_all("div",class_="product-card__card-subsection")
        booking_element = list(
            filter(
                lambda e:e.find("h5") and e.find("h5").text == "Tickets",
                lst)
        )[0]
        link_suffix = booking_element.find("p").find("a")["href"]
        link = f'https://www.rwsentosa.com{link_suffix}'
        #Problem: For some reason, the link doesn't work for some attractions if we use today's date.
        #Solution: Take the following week
        new_date = (date.today() + timedelta(days=7)).strftime("%Y-%m-%d")
        substring = "VisitDate="
        index = link.find(substring)
        date_modified_link = link[:index+len(substring)] + new_date
        return date_modified_link

    result = {}
    r = session.get(RWS_Attraction_url)
    soup = BeautifulSoup(r.text, "html.parser")
    attraction_list = soup.find_all("section", class_="listing-card")
    for a in attraction_list:
        attraction_name = a.find("h2",class_="listing-card__title").text
        attraction_link = get_link_from_attraction(a)
        result[attraction_name] = attraction_link
    return result
def get_attraction_listings(session: requests_html.HTMLSession,
                            attraction_links: dict[str,str],
                            items_unable_to_scrape: list) -> list:
    result = []
    for attraction_name, link in attraction_links.items():
        r = s.get(link)
        soup = BeautifulSoup(r.text,"html.parser")
        listings = soup.find_all("div", class_="offer-card__type")
        listings_data = []
        try:
            for l in listings:
                age_group = None
                category = None
                type_of_listing = "Main Attractions"
                p_title = l.find("h6",class_="offer-card__type-name").text
                p_price = l.find("span",class_="best-price__price").text
                listings_data.append({
                    "product": p_title,
                    "price": p_price,
                    "age_group": age_group,
                    "category": type_of_listing,
                    "sub_category": category,
                    "source": SEA_VIP_url
                })
            result.extend(listings_data)
            print(f"Successful Scrape: {attraction_name}")
        except AttributeError as e:
            items_unable_to_scrape.append([attraction_name, link])
            print(f"Unable to get prices from '{attraction_name}' category. Link used:\n{link}")
    return result

items_unable_to_scrape = []
#Collecting Promotion Data
promotions_url = "https://www.rwsentosa.com/en/promotions/attractions/"
promotion_category_links = get_promotion_category_links(s,promotions_url)
promotion_listings = get_promotions_listing(s,promotion_category_links,items_unable_to_scrape)

#Collecting Royal albatross data
items_unable_to_scrape.append(["Royal albatross","https://www.rwsentosa.com/en/special-experience/royal-albatross"])
print(f"Unable to get prices from 'Royal albatross' category. Link used:\nhttps://www.rwsentosa.com/en/special-experience/royal-albatross")

#Collecting SEA Aquarium VIP Experience
SEA_VIP_url = "https://www.rwsentosa.com/en/special-experience/seaa-vip-experience"
SEA_VIP_listings = get_SEA_VIP_listing(s,SEA_VIP_url,items_unable_to_scrape)

#Collecting Deep-dive Discoveries
deep_dive_url = "https://www.rwsentosa.com/en/special-experience/all-diving-experience"
deep_dive_category_links = get_deep_dive_category_links(s,deep_dive_url)
deep_dive_listings = get_deep_dive_listings(s,deep_dive_category_links,items_unable_to_scrape)

#Collectin Attraction Data
attractions_url = "https://www.rwsentosa.com/en/attractions"
attraction_links = get_attraction_links(s,attractions_url)
attraction_listings = get_attraction_listings(s,attraction_links,items_unable_to_scrape)
#Might need to edit to incorporate selenium

data_collected = []
data_collected.extend(promotion_listings)
data_collected.extend(SEA_VIP_listings)
data_collected.extend(deep_dive_listings)
data_collected.extend(attraction_listings)



print("hello")
"""def start_driver(RWSentosa_URL,headless=False):
    service = Service(executable_path=ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument('--headless')
    driver = webdriver.Chrome(service=service, options=options)
    return driver
def get():
    ''' Should return a list of dicts like:
    [
        {
            'product': 'Cable Car Sky Pass',
            'age_group': 'Adult',
            'price': 35.0,
        },
        {
            'product': 'Cable Car Sky Pass',
            'age_group': 'Child (4-12 years)',
            'price': 30.0,
        },
        {
            'product': 'Wings of Fire',
            'age_group': 'Adult',
            'price': 25.0,
        },
        {
            'product': 'Wings of Fire',
            'age_group': 'Child (4-12 years)',
            'price': 10.0,
        }
    ]
    How to get the data is up to you, but in the format above (or something else agreed upon).
    We can hand this over to another component that does the CRUD to the database, perhaps some ORM.
    This segregation of concerns is good for testing and maintainability, as well as side-effect management.
    '''
    return

if __name__ == "__main__":
    driver = start_driver(RWSentosa_URL="https://www.rwsentosa.com/en/attractions",headless=False)
"""