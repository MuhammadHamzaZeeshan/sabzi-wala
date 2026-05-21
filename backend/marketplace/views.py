from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product, PriceListing, Order
from .serializers import ProductSerializer, PriceListingSerializer, OrderSerializer

class ProductListAPIView(APIView):
    def get(self, request):
        items = Product.objects.all()
        serializer = ProductSerializer(items, many=True)
        return Response(serializer.data)

class PriceListAPIView(APIView):
    def get(self, request):
        items = PriceListing.objects.filter(is_available=True)
        serializer = PriceListingSerializer(items, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PriceListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else: 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class OrderListCreateAPIView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else: 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)