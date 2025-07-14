from rest_framework import serializers
from .models import Product, Category, Order, OrderItem, Review, Payment
from django.contrib.auth import get_user_model

User = get_user_model()

# ==================== PRODUCT ====================
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Product
        fields = '__all__'  # Includes tag_number and other fields automatically

# ==================== CATEGORY ====================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# ==================== ORDER ITEM ====================
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', use_url=True, read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'product_name', 'product_image', 'product_price']

# ==================== ORDER ====================
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)  # Optional: include user email in GET

    class Meta:
        model = Order
        fields = [
            'id',
            'customer_name',
            'customer_email',
            'phone_number',
            'shipping_address',
            'items',
            'created_at',
            'user'  # Optional display
        ]
        read_only_fields = ['created_at', 'user']

    def create(self, validated_data):
        request = self.context.get('request', None)
        items_data = validated_data.pop('items')
        user = request.user if request and request.user.is_authenticated else None

        order = Order.objects.create(user=user, **validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

# ==================== PASSWORD RESET CUSTOMIZATION ====================
class CustomPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value, is_active=True)
        except User.DoesNotExist:
            user = None
        self.context['user'] = user
        return value

    def get_user(self):
        return self.context.get('user')

# ==================== REVIEW ====================
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'product', 'user', 'created_at']

# ==================== PAYMENT ====================
class PaymentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
