from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListAPIView.as_view(), name='product-list'),
    path('listings/', views.PriceListAPIView.as_view(), name='price-list'),
    path('orders/', views.OrderListCreateAPIView.as_view(), name='order-list-create'),
]
