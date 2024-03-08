from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

url = 'https://www.thepalawansentosa.com/attractions-dining/'

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


href_links = _extract_all_hyperlinks(url)



"""# Hydrodash"""

hydrodash_url = 'https://hydrodash-online.globaltix.com/'

def _extract_hydrodash_product(link):
    hydro_data = []
    hydro_data.extend(_extract_hydrodash_single(link))
    hydro_data.extend(_extract_hydrodash_bundles(link))
    return hydro_data

def _extract_hydrodash_single(url):
    data = []
    driver.get(url)
    driver.find_elements(by=By.XPATH, value='/html/body/main/div[2]/div/section/div[3]/div[1]/div/div[2]/div[1]')[0].click()
    driver.implicitly_wait(5)
    name = driver.find_elements(By.CLASS_NAME, 'variation-name')
    price = driver.find_elements(By.CLASS_NAME, 'price-strong-normal')
    namelst = ([x.text for x in name])
    agelst = ['Per Person (6 Years Old And Above)'] * 3
    pricelst = ([x.text for x in price])
    for i in range(len(namelst)):
        dic = {}
        dic['product'] = namelst[i]
        dic['age group'] = agelst[i]
        dic['price'] = pricelst[i]
        data.append(dic)
    return data

def _extract_hydrodash_bundles(url):
    data = []
    links = ['/html/body/main/div[3]/div/div[3]/div[1]/div/div[2]', '/html/body/main/div[3]/div/div[3]/div[2]/div/div[2]']
    for link in links:
        driver.get(url)
        dic = {}
        driver.find_elements(by=By.XPATH, value=link)[0].click()
        driver.implicitly_wait(10)
        name = driver.find_elements(By.CLASS_NAME, 'variation-name')
        age = driver.find_elements(by=By.XPATH, value='/html/body/main/div[3]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/div[2]/form/div/div[1]/p/strong')
        price = driver.find_elements(by=By.XPATH, value='/html/body/main/div[3]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/div[2]/form/div/div[2]/div/div[2]/strong')
        dic['product'] = [x.text for x in name][0]
        dic['age group'] = [x.text for x in age][0]
        dic['price'] = [x.text for x in price][0]
        data.append(dic)
    return data

"""# Hyperdrive"""

hyperdrive_url = 'https://www.apex-timing.com/gokarts/sessions_booking.php?center=559'
hyperdrive_xpathlst = ['/html/body/div[2]/div[3]/div[2]/div[1]', '/html/body/div[2]/div[3]/div[2]/div[2]', '/html/body/div[2]/div[3]/div[2]/div[3]', '/html/body/div[2]/div[3]/div[2]/div[4]']

def _extract_hyperdrive_product(link, xpath):
    data = []
    driver.get(link)
    name = driver.find_elements(By.CLASS_NAME, 'title')
    price = driver.find_elements(By.CLASS_NAME, 'value')
    for path in xpath:
        dic = {}
        driver.find_element(by=By.XPATH, value=path).click()
        driver.implicitly_wait(5)
        namelst = ([x.text for x in name if x != 'ONLINE BOOKING' and x != 'Use a voucher:' and x != ''])
        agelst = ['9 Years Old And Above'] * 3
        pricelst = ([x.text for x in price if x != ''])
        filtered_namelst = list(filter(lambda x: x != 'ONLINE BOOKING' and x != 'Use a voucher:' and x != '', namelst))
        filtered_pricelst = list(filter(lambda x: x != 'ONLINE BOOKING' and x != 'Use a voucher:' and x != '', pricelst))
        for i in range(len(filtered_namelst)):
            dic = {}
            dic['product'] = filtered_namelst[i]
            dic['age group'] = agelst[i]
            dic['price'] = filtered_pricelst[i]
            data.append(dic)
    return data


"""# Ultragolf"""

ultragolf_url = 'https://ultragolf-online.globaltix.com/'

def _extract_ultragolf_product(link):
    ultra_data = []
    ultra_data.extend(_extract_ultragolf_single(link))
    ultra_data.extend(_add_ultra_child_data())
    ultra_data.extend(_extract_ultragolf_bundles(link))
    return ultra_data

def _extract_ultragolf_single(url):
    data = []
    driver.get(url)
    driver.find_elements(by=By.XPATH, value='/html/body/main/div[2]/div/section/div[3]/div[1]/div/div[2]/div[1]')[0].click()
    driver.implicitly_wait(5)
    name = driver.find_elements(By.CLASS_NAME, 'variation-name')
    price = driver.find_elements(By.CLASS_NAME, 'price-strong-normal')
    namelst = ([x.text for x in name])
    agelst = ['Adult'] * 2
    pricelst = ([x.text for x in price])
    for i in range(len(namelst)):
        dic = {}
        dic['product'] = namelst[i]
        dic['age group'] = agelst[i]
        dic['price'] = pricelst[i]
        data.append(dic)
    return data


def _add_ultra_child_data():
    child_data = []
    namelst = ['Admission Ticket','Admission Ticket with Weather Inclement Insurance']
    pricelst = ['SGD 18.00', 'SGD 20.00']
    for i in range(2):
        dic = {}
        dic['product'] = namelst[i]
        dic['age group'] = 'Child'
        dic['price'] = pricelst[i]
        child_data.append(dic)
    return child_data

def _extract_ultragolf_bundles(url):
    data = []
    links = ['/html/body/main/div[3]/div/div[3]/div[1]/div/div[2]', '/html/body/main/div[3]/div/div[3]/div[2]/div/div[2]']
    agexpath = ['/html/body/main/div[3]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/div[2]/form[1]/div/div[1]/p/strong', '/html/body/main/div[3]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/div[2]/form[2]/div/div[1]/p/strong']
    pricexpath = ['/html/body/main/div[3]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/div[2]/form[1]/div/div[2]/div/div[2]/strong', '/html/body/main/div[3]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/div[2]/form[2]/div/div[2]/div/div[2]/strong']
    for i in range(len(links)):
        driver.get(url)
        driver.find_elements(by=By.XPATH, value=links[i])[0].click()
        driver.implicitly_wait(30)
        for j in range(len(agexpath)):
            dic = {}
            name = driver.find_elements(By.CLASS_NAME, 'variation-name')
            age = driver.find_elements(by=By.XPATH, value = agexpath[j])
            price = driver.find_elements(by=By.XPATH, value = pricexpath[j])
            dic['product'] = [x.text for x in name][0]
            dic['age group'] = [x.text for x in age][0]
            dic['price'] = [x.text for x in price][0]
            data.append(dic)
    return data
#need debug
