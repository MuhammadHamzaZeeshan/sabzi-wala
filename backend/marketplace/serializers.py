from rest_framework import serializers
from . import models

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ['id', 'product_name', 'category']

class PriceListingSerializer(serializers.ModelSerializer):
    wholesaler = serializers.StringRelatedField(read_only=True) # Returns str fn value of the model
    product = ProductSerializer(read_only=True) # Returns data from nested serializer
    class Meta:
        model = models.PriceListing
        fields = ['id', 'wholesaler', 'product', 'price_per_kg', 'is_available', 'created_at','updated_at']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = ['id', 'retailer', 'listing', 'quantity_kg', 'total_price', 'created_at']
