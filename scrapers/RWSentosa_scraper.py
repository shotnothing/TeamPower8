#NOTE: Can consider scraping events as well. Can ask client.
    # https://www.rwsentosa.com/en/events
#NOTE: There are duplicates inside the resulting. Due to different timings of the same event. Need to edit later
#Note: Special Experience: Royal albatross needs to be entered manually. https://www.rwsentosa.com/en/special-experience/royal-albatross
#Note: need to use selenium to get the attraction data

import requests
import requests_html
from selenium.webdriver.common.by import By
from requests_html import HTMLSession
from bs4 import BeautifulSoup
from datetime import date,timedelta
from datetime import date
from supabase import create_client, Client, ClientOptions
from dotenv import load_dotenv
from selenium_functions import(
start_driver,
click_element_with_retry
)
import os

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
            promotions = soup.find("section",class_="offers-listing component-wrapper container").find_all("section",class_="listing-card")
            for p in promotions:
                age_group = None
                type_of_listing = "Promotion"
                p_image = p.find("div",class_="listing-card__image-wrapper").find("img")["src"]
                listing_card_content = p.find("div",class_="listing-card__content")
                p_title = listing_card_content.find("h3",class_="listing-card__title").text
                p_price = listing_card_content.find("span",class_="listing-card__price-value").text
                p_description = "\n".join([t for t in listing_card_content.find("div",class_="listing-card__description").stripped_strings])
                result.append({
                    "company":"rwssentosa",
                    "product_name": p_title,
                    "description":p_description,
                    "price": p_price,
                    "source_link":link,
                    "remarks": None,
                    "image": p_image,
                    "category": type_of_listing,
                    "subcategory": category,
                    "scrapped_at": date.today()
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
            category = None
            type_of_listing = "VIP Experience"
            p_image = cl.find("div",class_="listing-card__image-wrapper").find("img")["src"]
            p_title = cl.find("div",class_="listing-card__content-descriptive").find("h3",class_="listing-card__title").text
            p_price = cl.find("span",class_="listing-card__price-value").text
            p_description = "\n".join([t for t in cl.find("div",class_="listing-card__content-descriptive").stripped_strings])
            result.append({
                "company": "rwssentosa",
                "product_name":p_title,
                "description": p_description,
                "price": p_price,
                "source_link": SEA_VIP_url,
                "remarks": None,
                "image": p_image,
                "category":type_of_listing,
                "subcategory":category,
                "scrapped_at": date.today()
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
                type_of_listing = "Deep Dive"
                p_image = cl.find("div",class_="listing-card__image-wrapper").find("img")["src"]
                p_title = cl.find("h3",class_="listing-card__title").text
                p_price =cl.find("span",class_="listing-card__price-value").text
                p_description = "\n".join([t for t in cl.find("div",class_="listing-card__content-descriptive").stripped_strings])
                result.append({
                    "company": "rwssentosa",
                    "product_name": p_title,
                    "description": p_description,
                    "price": p_price,
                    "source_link": link,
                    "remarks": None,
                    "image":p_image,
                    "category": type_of_listing,
                    "subcategory": category,
                    "scrapped_at":date.today()
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
    """            for j in range(tt_tags_count):
                    print("We are in the 2nd loop")
                    tt = find_tt_tags(driver)[j]
                    driver.refresh()
                    find_tt_tags(driver)[j].click()
                    #click_element_with_retry(driver, tag, max_attempts=5)
                    """
    # To deal with stale element reference
    def find_ticket_types(driver):
        return driver.find_element(By.CLASS_NAME, "ticket-types").find_elements(By.CLASS_NAME, "ticket-types--ticket")
    def find_tt_tags(driver):
        return driver.find_element(By.CLASS_NAME, "ticket-tags").find_elements(By.CLASS_NAME, "swiper-slide")
    result = []
    for attraction_name, link in attraction_links.items():
        print(f"Attraction name: {attraction_name}")
        print(f"link: {link}")
        driver = start_driver(link,headless=True,implict_wait_time=10)
        ticket_types_count = len(find_ticket_types(driver))

        for i in range(ticket_types_count):
            driver.refresh()
            ticket_type = find_ticket_types(driver)[i]
            category = ticket_type.get_attribute('innerText')
            click_element_with_retry(driver,ticket_type,max_attempts=5)
            products = driver.find_element(By.CLASS_NAME, "ticket-offers").find_elements(By.CLASS_NAME, "offer-card")
            for p in products:
                p_info = p.find_element(By.CLASS_NAME,"offer-card__type")
                result.append({
                    "company": "rwssentosa",
                    "product_name": p_info.find_element(By.CLASS_NAME,"offer-card__type-name").text,
                    "description": p_info.find_element(By.CLASS_NAME,"offer-card__type-description").get_attribute('innerText'), #"\n".join([t for t in p_info.find_element(By.CLASS_NAME,"offer-card__type-description").stripped_strings]),
                    "price": p_info.find_element(By.CLASS_NAME,"best-price__price").text,
                    "source_link": link,
                    "remarks": None,
                    "image": p.find_element(By.CLASS_NAME,"offer-card__image").find_element(By.TAG_NAME,"img").get_attribute("src"),
                    "category": category,
                    "subcategory": None,
                    "scrapped_at": date.today()
                })

        driver.close()
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
for i in range(3):
    #This is not far from optimal coding. But we don't have time so...
    try:
        attraction_listings = get_attraction_listings(s,attraction_links,items_unable_to_scrape)
        break
    except:
        continue


data_collected = []
data_collected.extend(promotion_listings)
data_collected.extend(SEA_VIP_listings)
data_collected.extend(deep_dive_listings)
data_collected.extend(attraction_listings)

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
