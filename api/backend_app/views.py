from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

import pandas as pd
import numpy as np
import supabase as sb
import os

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
ci: int = os.environ.get("IS_CI", 0)

supabase: sb.Client = sb.create_client(
    url, key, 
    options = sb.ClientOptions().replace(schema="scraper")
)

if not os.path.exists('./analytics/export/similarity_matrix_L2.csv'):
    if ci:
        similarity_matrix = pd.DataFrame(np.random.rand(1000, 1000), index=range(1000), columns=range(1000))
    else:
        raise FileNotFoundError('Similarity matrix not found. Please run the analytics script.')
else:
    similarity_matrix = pd.read_csv('./analytics/export/similarity_matrix_L2.csv', index_col=0)

cache = {}

def test(request):
    '''Test route to check if the server is running.
    
    Returns:
        HttpResponse: A simple response to indicate that the server is running.
    '''
    user_ip = request.META.get('REMOTE_ADDR', '')
    user_agent = request.META.get('HTTP_USER_AGENT', '')

    response = f"Hello, world! Your IP address is {user_ip}. " \
               f"Your user agent is {user_agent}."

    return HttpResponse(response)

def get_product_info(product):
    '''Get product details from the product dictionary.
    
    Args:
        product (dict): The product dictionary.
        
    Returns:
        dict: The product details dictionary.
    '''
    details = {}

    details['product_id'] = product['id']
    details['company'] = 'mflg' if product['is_mflg'] else 'not mflg'
    details['product_name'] = product['title']
    details['scrape_timestamp'] = 'WIP'
    details['description'] = product['description']
    details['original_price'] = product['original_price']
    details['discounted_price'] = product['discounted_price']
    details['source_url'] = product['url']
    details['remarks'] = 'WIP'
    details['image_url'] = product['photo_url']
    details['tags'] = 'WIP'

    return details

def route_get_product_info(request, product_id):
    '''Get product details from the product ID.
    Refer to https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md for more details.
    
    Args:
        request (HttpRequest): The request object.
        product_id (str): The product ID.
        
    Returns:
        JsonResponse: The product details.
    '''
    if product_id in cache:
        return JsonResponse(cache[product_id])
    
    product = supabase \
        .from_("cleaned") \
        .select("*") \
        .eq("id", product_id) \
        .execute() \
        .data[0]
    
    details = get_product_info(product)

    return JsonResponse(details)

def route_get_product_filter(request):
    '''Filter products based on the query parameters.
    Refer to https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md for more details.
    
    Args:
        request (HttpRequest): The request object.
        
    Returns:
        JsonResponse: The filtered products.
    '''
    company = request.GET.get('company', None)
    name = request.GET.get('name', None)
    tag = request.GET.get('tag', None)
    from_index = int(request.GET.get('from', 0))
    to_index = int(request.GET.get('to', 10))

    if tag:
        return JsonResponse({'error': 'Tag filtering is depreciated.'})

    products = supabase \
        .from_("cleaned") \
        .select("*")
    
    if company:
        products = products \
            .eq("is_mflg", company.lower() == 'mflg')

    products = products \
        .range(from_index, to_index) \
        .execute() \
        .data

    details = {'products': [get_product_info(product) for product in products]}

    if name:
        import regex as re
        details['products'] = [
            product 
            for product in details['products'] 
            if re.search(
                f".*{name}.*",
                product['product_name'], 
                re.IGNORECASE)]
        
    return JsonResponse(details)

def get_similar_products(product_id, product, threshold):
    '''Get similar products based on the similarity matrix.
    
    Args:
        product_id (str): The product ID.
        product (dict): The product dictionary.
        threshold (float): The threshold for similarity.
    '''
    similar_product_ids_x = similarity_matrix.loc[int(product_id)]
    similar_product_ids_y = similarity_matrix[product_id]

    similar_product_ids_x = similar_product_ids_x[
        (similar_product_ids_x < threshold) & (similar_product_ids_x.index != product_id)]
    similar_product_ids_y = similar_product_ids_y[
        (similar_product_ids_y < threshold) & (similar_product_ids_y.index != int(product_id))]

    similar_product_ids = pd.concat([similar_product_ids_x, similar_product_ids_y])
    similar_product_ids = similar_product_ids.sort_values(ascending=True)
    return similar_product_ids
    
def get_product_analytics(product_id, product, threshold):
    '''Get product analytics based on the product ID.

    Args:
        product_id (str): The product ID.
        product (dict): The product dictionary.
        threshold (float): The threshold for similarity.

    Returns:
        list: The prices of similar products.
        list: The IDs of similar products.
        list: The names of similar products.
    '''
    similar_product_ids = get_similar_products(product_id, product, threshold)

    similar_products = []
    for similar_product in similar_product_ids.index:
        if similar_product in cache:
            similar_products.append(cache[similar_product])
            continue

        similar_product_info = supabase \
            .from_("cleaned") \
            .select("*") \
            .eq("id", similar_product) \
            .execute() \
            .data[0]
        product_info = get_product_info(similar_product_info)
        cache[similar_product] = product_info
        similar_products.append(product_info)

    prices = []
    for product in similar_products:
        if 'discounted_price' not in product or product['discounted_price'] is None:
            prices.append(product['original_price'])
        else:
            prices.append(product['discounted_price'])

    similar = [product['product_id'] for product in similar_products]
    similar_names = [product['product_name'] for product in similar_products]

    return prices, similar, similar_names, similar_products

def route_get_product_analytics(request, product_id):
    '''Get product analytics based on the product ID.
    Refer to https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md for more details.

    Args:
        request (HttpRequest): The request object.
        product_id (str): The product ID.

    Returns:
        JsonResponse: The product analytics.
    '''
    threshold = float(request.GET.get('threshold', 1))
    product = supabase \
            .from_("cleaned") \
            .select("*") \
            .eq("id", product_id) \
            .execute() \
            .data[0]
    
    prices, similar, similar_names, similar_products = get_product_analytics(product_id, product, threshold)
    details = get_product_info(product)

    if 'discounted_price' not in details or details['discounted_price'] is None:
        price = details['original_price']
    else:
        price = details['discounted_price']

    if len(prices):
        temp = prices.copy()
        temp.append(price)
        temp = sorted(temp)
        rank = temp.index(price)
        rank_normalized = rank / len(temp)
    else:
        rank = 0
        rank_normalized = 0

    response = {
        'prices': prices,
        'product_price': price,
        'similar': similar,
        'similar_products': similar_products,
        'product_name': details['product_name'],
        'rank': rank,
        'rank_normalized': rank_normalized,
    }

    return JsonResponse(response)

def route_work_in_progress(request):
    return JsonResponse({'error': 'This route is not yet implemented.'})

def route_depreciated(request):
    return JsonResponse({'error': 'This route is depreciated, and is no longer available.'})