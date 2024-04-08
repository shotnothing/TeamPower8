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

similarity_matrix = pd.read_csv('./analytics/export/similarity_matrix_L1.csv', index_col=0)

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
    product = supabase \
        .from_("cleaned") \
        .select("*") \
        .eq("id", product_id) \
        .execute() \
        .data[0]
    
    details = get_product_info(product)

    return JsonResponse(details)

def route_get_product_range(request):
    from_index = int(request.GET.get('from', 0))
    to_index = int(request.GET.get('to', 10))

    products = supabase \
        .from_("cleaned") \
        .select("*") \
        .range(from_index, to_index) \
        .execute() \
        .data
    
    details = {'products': [get_product_info(product) for product in products]}

    return JsonResponse(details)

def route_get_product_filter(request):
    company = request.GET.get('company', None)
    name = request.GET.get('name', None)
    tag = request.GET.get('tag', None)
    limit = int(request.GET.get('limit', 10))

    if tag:
        return JsonResponse({'error': 'Tag filtering is not yet implemented.'})

    if company:
        return JsonResponse({'error': 'Company filtering is not yet implemented.'})

    products = supabase \
        .from_("cleaned") \
        .select("*")
    
    if name:
        return JsonResponse({'error': 'Name filtering is unstable, disabled for now.'})
        products =  products.ilike("title", f"%{name}%")

    products = products \
        .limit(limit) \
        .execute() \
        .data

    details = {'products': [get_product_info(product) for product in products]}

    return JsonResponse(details)

def route_get_product_analytics(request, product_id):
    threshold = float(request.GET.get('threshold', 0.3))

    product = supabase \
        .from_("cleaned") \
        .select("*") \
        .eq("id", product_id) \
        .execute() \
        .data[0]
    details = get_product_info(product)

    similar_product_ids = similarity_matrix[product_id] \
        .sort_values(ascending=True) \
        .reset_index() \
        .rename(columns={product_id: 'similarity'}) \
        .query(f'similarity < {threshold}') \
        .query(f'id != {product_id}') \
        .to_dict(orient='records')
    
    similar_products = []
    for similar_product in similar_product_ids:
        similar_product = supabase \
            .from_("cleaned") \
            .select("*") \
            .eq("id", similar_product['id']) \
            .execute() \
            .data[0]
        similar_products.append(get_product_info(similar_product))


    # TODO: account for discounted price
    prices = [product['original_price'] for product in similar_products]
    similar = [product['product_id'] for product in similar_products]
    similar_names = [product['product_name'] for product in similar_products]

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