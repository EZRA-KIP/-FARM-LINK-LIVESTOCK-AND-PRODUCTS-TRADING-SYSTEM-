from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from django.conf import settings
from decimal import Decimal
import io
 
from .models import Product, Category, Order, UserProfile, Cart, OrderItem, Review, Payment
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, ReviewSerializer, PaymentSerializer

import requests
import base64
import datetime
import csv
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

User = get_user_model()

# ==================== PRODUCTS ====================
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

# ==================== CATEGORIES ====================
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

# ==================== ORDER CREATION ====================
@api_view(['POST'])
def create_order(request):
    data = request.data.copy()
    user = request.user if request.user.is_authenticated else None
    if user:
        data['user'] = user.id

    serializer = OrderSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        order = serializer.save()

        # ✅ Email Confirmation
        try:
            send_mail(
                subject="🧾 FarmLink Order Confirmation",
                message=(
                    f"Hello {order.customer_name},\n\n"
                    f"Your order (ID #{order.id}) has been received successfully. "
                    f"We’ll contact you shortly for delivery.\n\n"
                    f"Thank you for shopping with FarmLink!"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.customer_email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"[❌ Email Error] {e}")

        return Response({
            "message": "✅ Order placed successfully",
            "order": serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==================== GUEST CART ====================
class CartView(APIView):
    def get(self, request):
        cart = request.session.get('cart', [])
        return Response({'items': cart})

    def post(self, request):
        cart = request.data.get('items', [])
        request.session['cart'] = cart
        return Response({'detail': 'Cart updated', 'items': cart})

# ==================== AUTHENTICATED USER CART ====================
class PersistentCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response({'items': cart.items})

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items = request.data.get('items', [])
        cart.save()
        return Response({'detail': 'Cart updated', 'items': cart.items})

# ==================== AUTH TEST VIEW ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth_view(request):
    return Response({
        "message": "✅ API is working!",
        "user": request.user.email
    })

# ==================== M-PESA STK PUSH ====================
@api_view(['POST'])
def stk_push(request):
    phone = request.data.get('phone')
    consumer_key = '1DEEHZLVet8rk48sceBOq2KmKfLkvGKwQlE6rhUgk9nxBM24'
    consumer_secret = '3CM38AMKIlDAWTTsKj9OR4juPJ7xaXQas55Uc1YmNmPnqSWUMvqe4TnkP2cj6mh9'
    shortcode = '174379'
    passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'

    # Generate access token
    auth_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    r = requests.get(auth_url, auth=(consumer_key, consumer_secret))
    access_token = r.json().get('access_token')

    # Timestamp & password
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode((shortcode + passkey + timestamp).encode()).decode()

    # STK Push payload
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": 1,
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": "https://example.com/api/mpesa/callback/",
        "AccountReference": "Farmlink",
        "TransactionDesc": "FarmLink Purchase"
    }

    stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    response = requests.post(stk_url, headers=headers, json=payload)

    return Response(response.json())

# ==================== ORDER HISTORY (LOGGED-IN USER) ====================
class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(user_orders, many=True)
        return Response(serializer.data)

# ==================== MY ORDERS REPORT ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders_report(request):
    user = request.user
    orders = Order.objects.filter(user=user)

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "My Orders Report")

    p.setFont("Helvetica", 12)
    y = height - 90
    p.drawString(50, y, "Order ID")
    p.drawString(120, y, "Date")
    p.drawString(200, y, "Product")
    p.drawString(350, y, "Qty")
    p.drawString(400, y, "Price")
    p.drawString(470, y, "Status")
    y -= 20

    for order in orders:
        for item in order.items.all():
            # Convert Decimal128 to Decimal, then to float
            price = float(Decimal(str(item.product.price)))
            total = price * item.quantity
            p.drawString(50, y, str(order.id))
            p.drawString(120, y, order.created_at.strftime("%Y-%m-%d"))
            p.drawString(200, y, item.product.name)
            p.drawString(350, y, str(item.quantity))
            p.drawString(400, y, f"{price:.2f}")
            p.drawString(470, y, getattr(order, 'status', ''))
            y -= 20
            if y < 50:
                p.showPage()
                y = height - 50

    p.save()
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="my_orders_report.pdf"'
    return response

# ==================== ADMIN REPORTS ====================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def sales_report(request):
    orders = Order.objects.all()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="sales_report.csv"'
    writer = csv.writer(response)
    writer.writerow(['Order ID', 'Date', 'Customer', 'Total', 'Status'])
    for order in orders:
        writer.writerow([order.id, order.created_at, getattr(order, 'customer_name', ''), order.total, order.status])
    return response

@api_view(['GET'])
@permission_classes([IsAdminUser])
def inventory_report(request):
    products = Product.objects.all()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="inventory_report.csv"'
    writer = csv.writer(response)
    writer.writerow(['Product ID', 'Name', 'Category', 'Stock', 'Price'])
    for product in products:
        writer.writerow([product.id, product.name, getattr(product, 'category', ''), product.stock, product.price])
    return response

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_order_status(request, order_id):
    from .models import Order  # adjust import if needed
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    status = request.data.get('status')
    if status not in dict(Order.STATUS_CHOICES):
        return Response({'error': 'Invalid status'}, status=400)
    order.status = status
    order.save()
    return Response({'message': 'Order status updated', 'order_id': order.id, 'status': order.status})

# ==================== REVIEWS ====================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, product_id):
    product = Product.objects.get(pk=product_id)
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, product=product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def product_reviews(request, product_id):
    reviews = Review.objects.filter(product_id=product_id)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

# ==================== ADMIN ORDER VIEW ====================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_orders(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# ==================== PAYMENT ====================
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users only see their own payments
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user to the logged-in user
        serializer.save(user=self.request.user)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Payment

@api_view(['POST'])
@permission_classes([AllowAny])  # Safaricom will not be authenticated
def mpesa_callback(request):
    # Adjust these keys based on your actual M-Pesa callback payload
    transaction_id = request.data.get("CheckoutRequestID")
    result_code = str(request.data.get("ResultCode"))  # "0" means success

    try:
        payment = Payment.objects.get(transaction_id=transaction_id)
        if result_code == "0":
            payment.status = "completed"
        else:
            payment.status = "failed"
        payment.save()
        return Response({"message": "Payment status updated"}, status=200)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)
