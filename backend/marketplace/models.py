from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# ==========================================
# 1. USER MODEL (Role-Based Authentication)
# ==========================================
class CustomUser(AbstractUser):
    CHOICES = (
        ('ADMIN', 'System Administrator'),
        ('WHOLESALER', 'wholesaler'),
        ('RETAILER', 'retailer')
    )
    
    role = models.CharField(max_length=50, choices=CHOICES, default='RETAILER')
    shop_name = models.CharField(max_length=25, blank=True, null=True)
    phone_number = models.CharField(max_length=13, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    

# ==========================================
# 2. PRODUCT MASTER MODEL
# ==========================================
class Product(models.Model):
    CATEGORY_CHOICES = (
        ('FRUIT', 'fruit'),
        ('VEGETABLE', 'vegetable')
    )
    product_name = models.CharField(max_length=255, unique=True, db_index=True)
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} ({self.get_category_display()})"
    

# ==========================================
# 3. PRICE LISTING MODEL
# ==========================================
class PriceListing(models.Model):
    wholesaler = models.ForeignKey(CustomUser, related_name='listings', on_delete=models.CASCADE, limit_choices_to={'role': 'WHOLESALER'})

    product = models.ForeignKey(Product, related_name='price_listings', on_delete=models.CASCADE)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('wholesaler', 'product') # Must be unique

    def __str__(self):
        return f"{self.wholesaler.shop_name or self.wholesaler.username} - {self.product.product_name}: {self.price_per_kg} PKR/KG"
    

# ==========================================
# 4. ORDER MODEL
# ==========================================
class Order(models.Model):
    retailer = models.ForeignKey(CustomUser, related_name='orders', on_delete=models.CASCADE, limit_choices_to={'role':'RETAILER'})

    listing = models.ForeignKey(PriceListing, related_name='orders', on_delete=models.CASCADE)
    quantity_kg = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total_price = self.listing.price_per_kg * self.quantity_kg
        super().save(*args, **kwargs)