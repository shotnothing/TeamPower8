from bs4 import BeautifulSoup
import requests

url = "https://www.skyparksentosa.com/activities"

page = requests.get(url)

soup = BeautifulSoup(page.text, 'html.parser')

print(soup)

#soup.find('div')

#soup.find_all('div')

products = soup.find_all('div', class_='item')

#Retriving product name
tags = []
#Loop through each div element
for product in products:
    # Find the <a> tag within the current div
    a_tags = product.find_all('a', href=lambda href: href and href.startswith('/activities/'))

    # Append the found <a> tags to the list
    tags.extend(a_tags)
print(tags)

#Tidying name tags
name_tags = [a_tag['href'][12:] for a_tag in tags]
print(name_tags)

unique_activities = []
[unique_activities.append(x) for x in name_tags if x not in unique_activities]
print(unique_activities)

#Retriving Prices
price_tags = []
for product in products:
    # Find the <div> tag within the current div
    price_div = product.find('div', class_='price-bold')
    price_text = price_div.text.strip()

    # Append the found <a> tags to the list
    price_tags.append(price_text)

print(price_tags)


#Dict to store activities and their prices
keys = unique_activities
values = price_tags

skypark = dict(zip(keys,values))

print(skypark)