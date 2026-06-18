from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem, Wishlist, Order, Coupon
from .serializers import (
    CartSerializer, CartItemSerializer,
    WishlistSerializer, OrderSerializer, CouponSerializer
)
from products.models import Product
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count
from django.utils import timezone
import datetime

from django_filters.rest_framework import DjangoFilterBackend


# ─── Cart Views ───────────────────────────────────────────

class CartView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared'})


class CartItemView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def put(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()

        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
            item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)


# ─── Wishlist Views ────────────────────────────────────────

class WishlistView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(WishlistSerializer(wishlist).data)


class WishlistToggleView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, product_id):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        if product in wishlist.products.all():
            wishlist.products.remove(product)
            return Response({'message': 'Removed from wishlist', 'wishlisted': False})
        else:
            wishlist.products.add(product)
            return Response({'message': 'Added to wishlist', 'wishlisted': True})


# ─── Coupon Views ──────────────────────────────────────────

class ApplyCouponView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        code = request.data.get('code', '').upper()
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            cart = Cart.objects.get(user=request.user)
            if cart.total < coupon.min_order_amount:
                return Response(
                    {'error': f'Minimum order amount is ৳{coupon.min_order_amount}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(CouponSerializer(coupon).data)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid or expired coupon'}, status=status.HTTP_404_NOT_FOUND)


# ─── Order Views ───────────────────────────────────────────

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    def perform_create(self, serializer):
        serializer.save()


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAdminUser,)
    queryset = Order.objects.all().prefetch_related('items__product')
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('status', 'payment_method')


class AdminOrderUpdateView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAdminUser,)
    queryset = Order.objects.all()

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        order.status = request.data.get('status', order.status)
        order.save()
        return Response(OrderSerializer(order).data)


class AdminAnalyticsView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        from products.models import Product
        from django.contrib.auth import get_user_model
        User = get_user_model()

        today = timezone.now().date()
        last_7_days = today - datetime.timedelta(days=6)

        total_revenue = Order.objects.filter(
            status='delivered'
        ).aggregate(total=Sum('total'))['total'] or 0

        total_orders = Order.objects.count()
        total_customers = User.objects.filter(is_staff=False).count()
        total_products = Product.objects.filter(is_active=True).count()

        # Daily revenue last 7 days
        daily_revenue = []
        for i in range(7):
            day = last_7_days + datetime.timedelta(days=i)
            revenue = Order.objects.filter(
                created_at__date=day,
                status='delivered'
            ).aggregate(total=Sum('total'))['total'] or 0
            daily_revenue.append({
                'date': day.strftime('%b %d'),
                'revenue': float(revenue)
            })

        # Orders by status
        orders_by_status = {}
        for status, _ in Order.STATUS_CHOICES:
            orders_by_status[status] = Order.objects.filter(status=status).count()

        # Recent orders
        recent_orders = OrderSerializer(
            Order.objects.all().order_by('-created_at')[:5],
            many=True
        ).data

        return Response({
            'total_revenue': float(total_revenue),
            'total_orders': total_orders,
            'total_customers': total_customers,
            'total_products': total_products,
            'daily_revenue': daily_revenue,
            'orders_by_status': orders_by_status,
            'recent_orders': recent_orders,
        })


class AdminCouponListCreateView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all().order_by('-created_at')
    permission_classes = (IsAdminUser,)

    def get_serializer_class(self):
        return CouponSerializer


class AdminCouponUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    permission_classes = (IsAdminUser,)
    serializer_class = CouponSerializer