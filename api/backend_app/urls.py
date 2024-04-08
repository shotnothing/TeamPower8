from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test, name='test'),
    path('product/p/<str:product_id>/', views.route_get_product_info, name='get_product_info'),
    path('product/range/', views.route_get_product_range, name='get_product_range'),
    path('product/filter/', views.route_get_product_filter, name='get_product_filter'),
    path('company/all/', views.route_work_in_progress, name='get_company_list'),
    path('company/c/<str:company_id>/', views.route_get_product_info, name='get_company_info'),
    path('analytics/p/<str:product_id>/', views.route_get_product_analytics, name='get_product_analytics'),
]
