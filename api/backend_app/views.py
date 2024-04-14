from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

import pandas as pd
import numpy as np
import supabase as sb
import os

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: sb.Client = sb.create_client(
    url, key, 
    options = sb.ClientOptions().replace(schema="scraper")
)

similarity_matrix = pd.read_csv('./analytics/export/similarity_matrix_L2.csv', index_col=0)

cache = {}

def test(request):
    user_ip = request.META.get('REMOTE_ADDR', '')
    user_agent = request.META.get('HTTP_USER_AGENT', '')

    # Bear witness to templating in raw string!
    response = f"Hello, world! Your IP address is {user_ip}. " \
               f"Your user agent is {user_agent}."

    return HttpResponse(response)

def get_product_info(product):
    details = {}

    details['product_id'] = product['id']
    details['company'] = 'WIP'
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
    
    if name:
        return JsonResponse({'error': 'Name filtering in api is unstable, implement it client-side.'})
        # products = products \
        #     .ilike("title", f"%{name}%")
    
    if company:
        products = products \
            .eq("is_mflg", company.lower() == 'mflg')

    products = products \
        .range(from_index, to_index) \
        .execute() \
        .data
    
    

    details = {'products': [get_product_info(product) for product in products]}

    return JsonResponse(details)

def get_similar_products(product, threshold):
    product_id = product['id']

    similar_product_ids_x = similarity_matrix.loc[int(product_id)]
    similar_product_ids_y = similarity_matrix[product_id]

    similar_product_ids_x = similar_product_ids_x[
        (similar_product_ids_x < threshold) & (similar_product_ids_x.index != product_id)]
    similar_product_ids_y = similar_product_ids_y[
        (similar_product_ids_y < threshold) & (similar_product_ids_y.index != int(product_id))]

    similar_product_ids = pd.concat([similar_product_ids_x, similar_product_ids_y])
    similar_product_ids = similar_product_ids.sort_values(ascending=True)
    return similar_product_ids
    
def get_product_analytics(product, threshold):

    similar_product_ids = get_similar_products(product, threshold)

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

    # TODO: account for discounted price
    prices = [product['original_price'] for product in similar_products]
    similar = [product['product_id'] for product in similar_products]
    similar_names = [product['product_name'] for product in similar_products]

    return prices, similar, similar_names

def route_get_product_analytics(request, product_id):
    threshold = float(request.GET.get('threshold', 0.1))

    product = supabase \
            .from_("cleaned") \
            .select("*") \
            .eq("id", product_id) \
            .execute() \
            .data[0]
    
    prices, similar, similar_names = get_product_analytics(product, threshold)
    details = get_product_info(product)

    response = {
        'prices': prices,
        'product_price': details['original_price'],
        'similar': similar,
        'similar_names': similar_names,
        'product_name': details['product_name'],
    }

    return JsonResponse(response)

def route_work_in_progress(request):
    return JsonResponse({'error': 'This route is not yet implemented.'})

def route_depreciated(request):
    return JsonResponse({'error': 'This route is depreciated, and is no longer available.'})