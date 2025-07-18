from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    CategoryViewSet,
    PaymentViewSet,  # <-- Add this line
    create_order,
    CartView,
    PersistentCartView,
    test_auth_view,
    stk_push,
    MyOrdersView,  # ✅ Import this
    my_orders_report,
    sales_report,
    inventory_report,
    update_order_status,  # Import the view for updating order status
    product_reviews,
    add_review,
    admin_orders,  # Import the admin_orders view
    mpesa_callback,  # Import the M-Pesa callback view
)
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'payments', PaymentViewSet)  # <-- Add this line

urlpatterns = [
    path('', include(router.urls)),

    # ✅ Order placement
    path('orders/', create_order, name='create-order'),

    # ✅ Order history (new)
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),

    # ✅ Cart endpoints
    path('api/cart/', CartView.as_view(), name='cart'),
    path('api/persistent-cart/', PersistentCartView.as_view(), name='persistent-cart'),

    # ✅ M-Pesa STK Push
    path('api/mpesa/stk-push/', stk_push, name='stk-push'),

    # ✅ Test authenticated access
    path('api/test/', test_auth_view, name='test-auth'),

    # ✅ Djoser authentication
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),

    # ✅ My orders report
    path('api/reports/my-orders/', my_orders_report, name='my-orders-report'),
    path('api/my-orders-report/', my_orders_report, name='my_orders_report'),  # New URL for my_orders_report

    # ✅ Sales and inventory reports
    path('api/reports/sales/', sales_report, name='sales-report'),
    path('api/reports/inventory/', inventory_report, name='inventory-report'),

    # ✅ Update order status
    path('api/orders/<int:order_id>/status/', update_order_status, name='update-order-status'),

    # ✅ Product reviews
    path('api/products/<int:product_id>/reviews/', product_reviews, name='product-reviews'),
    path('api/products/<int:product_id>/add-review/', add_review, name='add-review'),

    # ✅ Admin order management
    path('api/admin/orders/', admin_orders, name='admin-orders'),

    # ✅ M-Pesa callback
    path('api/mpesa/callback/', mpesa_callback, name='mpesa-callback'),
]

# ✅ Serve uploaded media during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
