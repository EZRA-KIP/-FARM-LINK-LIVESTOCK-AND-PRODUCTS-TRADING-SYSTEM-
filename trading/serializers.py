from rest_framework import serializers
from .models import Product, Category, Order, OrderItem, Review, Payment, Cart
from django.contrib.auth import get_user_model

User = get_user_model()

# ==================== PRODUCT ====================
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def to_internal_value(self, data):
        # Accept both category ID and name
        category_value = data.get('category')
        if category_value:
            from .models import Category
            try:
                # Try to get by ID
                category_obj = Category.objects.get(pk=int(category_value))
            except (ValueError, Category.DoesNotExist):
                # If not found by ID, try by name (case-insensitive)
                category_obj, created = Category.objects.get_or_create(
                    name__iexact=category_value,
                    defaults={'name': category_value}
                )
            data['category'] = category_obj.id
        return super().to_internal_value(data)

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

# ==================== CART ====================
from .models import Cart, Product

class CartDetailSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'subtotal', 'tax', 'total']

    def get_items(self, obj):
        print("Cart items:", obj.items)
        items = []
        for item in obj.items:
            try:
                product = Product.objects.get(id=item['id'])
                quantity = item.get('quantity', 1)
                price = float(product.price)
                subtotal = float(price * quantity)
                items.append({
                    'id': product.id,
                    'name': product.name,
                    'price': price,
                    'quantity': quantity,
                    'subtotal': subtotal,
                })
            except Product.DoesNotExist:
                print("Product not found for item:", item)
                continue
        return items

    def get_subtotal(self, obj):
        return round(sum(item['subtotal'] for item in self.get_items(obj)), 2)

    def get_tax(self, obj):
        subtotal = self.get_subtotal(obj)
        tax_rate = 0.16  # 16% VAT
        return round(subtotal * tax_rate, 2)

    def get_total(self, obj):
        return round(self.get_subtotal(obj) + self.get_tax(obj), 2)
