import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import date,timedelta
from datetime import date
from selenium.webdriver.chrome.options import Options
import os
from supabase import create_client, Client
from dotenv import load_dotenv

#url = 'https://www.thepalawansentosa.com/attractions-dining/'

chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome()

def get(link, xpath):
    product_data = []
    product_data.extend(_extract_hydrodash_product(link))
    product_data.extend(_extract_hyperdrive_product(link, xpath))
    product_data.extend(_extract_ultragolf_product(link))
    return product_data

def _extract_all_hyperlinks(hyperlink):
    href_links = []
    driver.get(hyperlink)
    links = driver.find_elements(by=By.XPATH, value="//a[@href]")
    for link in links:
      l = link.get_attribute("href")
      if (l not in href_links) and (l is not None):
        href_links.append(l)
    return href_links


href_links = _extract_all_hyperlinks('https://www.thepalawansentosa.com/attractions-dining/')



"""# Hydrodash"""

hydrodash_url = 'https://hydrodash-online.globaltix.com/'

def _extract_hydrodash_product(url):
    hydro_data = []
    driver.get(url)
    time.sleep(5)
    hydro_data.extend(_extract_ultragolf_single())
    driver.get(url)
    time.sleep(5)
    hydro_data.extend(_extract_ultragolf_bundles_drink())
    driver.get(url)
    time.sleep(5)
    hydro_data.extend(_extract_ultragolf_bundles_food())
    return hydro_data

def _extract_hydrodash_single():
    data = []
    category = "attractions"
    subcategory = "HydroDash"
    url = 'https://hydrodash-online.globaltix.com/'
    image = driver.find_elements(By.CSS_SELECTOR, 'div.col-12.p-0.card_image_container')[0].find_element(By.TAG_NAME,"img").get_attribute("src")
    driver.find_element(By.CLASS_NAME, 'list-price').click()
    description = driver.find_element(By.CLASS_NAME, 'product-description').get_attribute('innerText')
    for i in range(2):
        data.append({
            "company" : "thepalawansentosa",
            "product_name" : "HydroDash " + driver.find_elements(By.CLASS_NAME, 'variation-name')[i].text,
            "price" : driver.find_elements(By.CLASS_NAME, 'price-strong-normal')[i].text,
            "scrapped_at" : date.today(),
            "description" : description,
            "source_link" : url,
            "remarks" : driver.find_elements(By.CSS_SELECTOR, 'div.card-body.px-3.py-3.ticket-details-box.mb-3')[1].get_attribute('innerText'),
            "image" : image,
            "category": category,
            "subcategory" : subcategory
        })
    time.sleep(3)
    return data

def _extract_hydrodash_drink():
    data = []
    category = "attractions"
    subcategory = "HydroDash"
    url = 'https://hydrodash-online.globaltix.com/'
    description = driver.find_element(By.CSS_SELECTOR, 'div.group.inner.list-group-item-text.product-description.justify').get_attribute('innerText')
    image = driver.find_elements(By.CSS_SELECTOR, 'div.col-12.p-0.card_image_container')[4].find_element(By.TAG_NAME,"img").get_attribute("src")
    driver.find_elements(By.CLASS_NAME, 'list-price')[4].click()
    time.sleep(3)
    driver.find_elements(By.CSS_SELECTOR, 'div.row.ticket-card')[0].click()
    data.append({
        "company" : "thepalawansentosa",
        "product_name" : driver.find_element(By.CSS_SELECTOR, 'h2.row-title.mb-0.row-title-md').get_attribute("innerText"),
        "price" : driver.find_element(By.CSS_SELECTOR, 'div.col-12.price.px-4.px-md-0.text-left.text-md-right').find_elements(By.TAG_NAME, 'strong')[0].get_attribute("innerText"),
        "scrapped_at" : date.today(),
        "description" : description,
        "source_link" : url,
        "remarks" : driver.find_elements(By.CLASS_NAME, 'viewmore-card')[2].get_attribute('innerText'),
        "image" : image,
        "category": category,
        "subcategory" : subcategory
        })
    return data

def _extract_hydrodash_food():
    data = []
    category = "attractions"
    subcategory = "HydroDash"
    url = 'https://hydrodash-online.globaltix.com/'
    description = driver.find_element(By.CSS_SELECTOR, 'div.group.inner.list-group-item-text.product-description.justify').get_attribute('innerText')
    image = driver.find_elements(By.CSS_SELECTOR, 'div.col-12.p-0.card_image_container')[5].find_element(By.TAG_NAME,"img").get_attribute("src")
    driver.find_elements(By.CLASS_NAME, 'list-price')[5].click()
    time.sleep(3)
    driver.find_elements(By.CSS_SELECTOR, 'div.row.ticket-card')[0].click()
    data.append({
        "company" : "thepalawansentosa",
        "product_name" : driver.find_element(By.CSS_SELECTOR, 'h2.row-title.mb-0.row-title-md').get_attribute("innerText"),
        "price" : driver.find_element(By.CSS_SELECTOR, 'div.col-12.price.px-4.px-md-0.text-left.text-md-right').find_elements(By.TAG_NAME, 'strong')[0].get_attribute("innerText"),
        "scrapped_at" : date.today(),
        "description" : description,
        "source_link" : url,
        "remarks" : driver.find_elements(By.CLASS_NAME, 'viewmore-card')[2].get_attribute('innerText'),
        "image" : image,
        "category": category,
        "subcategory" : subcategory
        })
    return data

"""# Hyperdrive"""

hyperdrive_url = 'https://www.apex-timing.com/gokarts/sessions_booking.php?center=559'
hyperdrive_xpathlst = ['/html/body/div[2]/div[3]/div[2]/div[1]', '/html/body/div[2]/div[3]/div[2]/div[2]', '/html/body/div[2]/div[3]/div[2]/div[3]', '/html/body/div[2]/div[3]/div[2]/div[4]']

def _extract_hyperdrive_product(link, xpath):
    data = []
    driver.get(link)
    category = "attractions"
    subcategory = "Hyperdrive"
    url = 'https://www.apex-timing.com/gokarts/sessions_booking.php?center=559'
    name = driver.find_elements(By.CLASS_NAME, 'title')
    price = driver.find_elements(By.CLASS_NAME, 'value')
    description = driver.find_elements(By.CLASS_NAME, 'description')
    for path in xpath:
        dic = {}
        driver.find_element(by=By.XPATH, value=path).click()
        time.sleep(3)
        namelst = ([x.text for x in name if x != 'ONLINE BOOKING' and x != 'Use a voucher:' and x != ''])
        pricelst = ([x.text for x in price if x != ''])
        descriptionlst = ([x.text for x in description if x != ''])
        filtered_namelst = list(filter(lambda x: x != 'ONLINE BOOKING' and x != 'Use a voucher:' and x != '', namelst))
        filtered_pricelst = list(filter(lambda x: x != 'ONLINE BOOKING' and x != 'Use a voucher:' and x != '', pricelst))
        filtered_descriptionlst = list(filter(lambda x: x != 'ONLINE BOOKING' and x != 'Use a voucher:' and x != '', descriptionlst))
        for i in range(len(filtered_namelst)):
            data.append({
                "company" : "thepalawansentosa",
                "product_name" : filtered_namelst[i],
                "price" : filtered_pricelst[i],
                "scrapped_at" : date.today(),
                "description" : filtered_descriptionlst[i],
                "source_link" : url,
                "remarks" : None,
                "image" : None,
                "category": category,
                "subcategory" : subcategory
                })
    return data


"""# Ultragolf"""

ultragolf_url = 'https://ultragolf-online.globaltix.com/'

def _extract_ultragolf_product(url):
    ultra_data = []
    driver.get(url)
    time.sleep(5)
    ultra_data.extend(_extract_ultragolf_single())
    driver.get(url)
    time.sleep(5)
    ultra_data.extend(_extract_ultragolf_bundles_drink())
    driver.get(url)
    time.sleep(5)
    ultra_data.extend(_extract_ultragolf_bundles_food())
    return ultra_data

def _extract_ultragolf_single():
    data = []
    category = "attractions"
    subcategory = "UltraGolf"
    url = 'https://ultragolf-online.globaltix.com/'
    image = driver.find_element(By.CSS_SELECTOR, 'div.col-12.p-0.card_image_container').find_element(By.TAG_NAME,"img").get_attribute("src")
    driver.find_element(By.CLASS_NAME, 'list-price').click()
    description = driver.find_element(By.CLASS_NAME, 'product-description').get_attribute('innerText')
    time.sleep(3)
    driver.find_elements(By.CSS_SELECTOR, 'div.row.ticket-card')[0].click()
    data.append({
        "company" : "thepalawansentosa",
        "product_name" : driver.find_element(By.CSS_SELECTOR, 'h2.row-title.mb-0.row-title-md.pr-5').get_attribute("innerText"),
        "price" : driver.find_element(By.CSS_SELECTOR, 'div.col-12.price.px-4.px-md-0.text-left.text-md-right').find_elements(By.TAG_NAME, 'strong')[0].get_attribute("innerText"),
        "scrapped_at" : date.today(),
        "description" : description,
        "source_link" : url,
        "remarks" : driver.find_elements(By.CLASS_NAME, 'viewmore-card')[1].get_attribute('innerText'),
        "image" : image,
        "category": category,
        "subcategory" : subcategory
        })
    return data


def _extract_ultragolf_bundles_drink():
    data = []
    category = "attractions"
    subcategory = "UltraGolf"
    url = 'https://ultragolf-online.globaltix.com/'
    description = driver.find_element(By.CSS_SELECTOR, 'div.group.inner.list-group-item-text.product-description.justify').get_attribute('innerText')
    image = driver.find_elements(By.CSS_SELECTOR, 'div.col-12.p-0.card_image_container')[4].find_element(By.TAG_NAME,"img").get_attribute("src")
    driver.find_elements(By.CLASS_NAME, 'list-price')[4].click()
    time.sleep(3)
    driver.find_elements(By.CSS_SELECTOR, 'div.row.ticket-card')[0].click()
    data.append({
        "company" : "thepalawansentosa",
        "product_name" : driver.find_element(By.CSS_SELECTOR, 'h2.row-title.mb-0.row-title-md').get_attribute("innerText"),
        "price" : driver.find_element(By.CSS_SELECTOR, 'div.col-12.price.px-4.px-md-0.text-left.text-md-right').find_elements(By.TAG_NAME, 'strong')[0].get_attribute("innerText"),
        "scrapped_at" : date.today(),
        "description" : description,
        "source_link" : url,
        "remarks" : driver.find_elements(By.CLASS_NAME, 'viewmore-card')[2].get_attribute('innerText'),
        "image" : image,
        "category": category,
        "subcategory" : subcategory
        })
    return data


def _extract_ultragolf_bundles_food():
    data = []
    category = "attractions"
    subcategory = "UltraGolf"
    url = 'https://ultragolf-online.globaltix.com/'
    description = driver.find_element(By.CSS_SELECTOR, 'div.group.inner.list-group-item-text.product-description.justify').get_attribute('innerText')
    image = driver.find_elements(By.CSS_SELECTOR, 'div.col-12.p-0.card_image_container')[5].find_element(By.TAG_NAME,"img").get_attribute("src")
    driver.find_elements(By.CLASS_NAME, 'list-price')[5].click()
    time.sleep(3)
    driver.find_elements(By.CSS_SELECTOR, 'div.row.ticket-card')[0].click()
    data.append({
        "company" : "thepalawansentosa",
        "product_name" : driver.find_element(By.CSS_SELECTOR, 'h2.row-title.mb-0.row-title-md').get_attribute("innerText"),
        "price" : driver.find_element(By.CSS_SELECTOR, 'div.col-12.price.px-4.px-md-0.text-left.text-md-right').find_elements(By.TAG_NAME, 'strong')[0].get_attribute("innerText"),
        "scrapped_at" : date.today(),
        "description" : description,
        "source_link" : url,
        "remarks" : driver.find_elements(By.CLASS_NAME, 'viewmore-card')[2].get_attribute('innerText'),
        "image" : image,
        "category": category,
        "subcategory" : subcategory
        })
    return data


hydrodash_product = _extract_hydrodash_product(hydrodash_url)
hyperdrive_product = _extract_hyperdrive_product(hyperdrive_url, hyperdrive_xpathlst)
ultragolf_product = _extract_ultragolf_product(ultragolf_url)
data_collected = []
data_collected.extend(hydrodash_product)
data_collected.extend(hyperdrive_product)
data_collected.extend(ultragolf_product)

print(data_collected)


#Further cleaning
def further_cleaning():
    for d in data_collected:
        d["scrapped_at"] = d["scrapped_at"].isoformat()
        d["price"] = float(''.join([c for c in d["price"] if c.isdigit() or c == '.']))

further_cleaning()

# Inserting data into Supabase
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
data, count = supabase.table("sc_products").insert(data_collected).execute()
