from rest_framework import serializers
from .models import Cart, CartItem, Wishlist, Order, OrderItem, Coupon
from products.serializers import ProductListSerializer
from django.db import models


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = "__all__"


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = "__all__"

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    coupon_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = (
            'id', 'status', 'payment_status', 'subtotal',
            'discount_amount', 'delivery_charge', 'total', 'created_at',
        )

    def create(self, validated_data):
        coupon_code = validated_data.pop('coupon_code', None)
        user = self.context['request'].user

        # Get cart
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError('Your cart is empty')

        if not cart.items.exists():
            raise serializers.ValidationError('Your cart is empty')

        # Calculate totals
        subtotal = cart.total
        discount_amount = 0
        coupon = None

        if coupon_code:
            try:
                coupon = Coupon.objects.get(
                    code=coupon_code.upper(),
                    is_active=True,
                    used_count__lt=models.F('max_uses')
                )
                if subtotal >= coupon.min_order_amount:
                    discount_amount = subtotal * coupon.discount_percent / 100
                    coupon.used_count += 1
                    coupon.save()
            except Coupon.DoesNotExist:
                raise serializers.ValidationError({'coupon_code': 'Invalid or expired coupon'})

        delivery_charge = 0 if subtotal >= 500 else 60
        total = subtotal - discount_amount + delivery_charge

        # Create order
        order = Order.objects.create(
            user=user,
            coupon=coupon,
            subtotal=subtotal,
            discount_amount=discount_amount,
            delivery_charge=delivery_charge,
            total=total,
            **validated_data
        )

        # Create order items + deduct stock
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.final_price,
            )
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()

        # Clear cart
        cart.items.all().delete()

        return order
    
class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"
        read_only_fields = ('id', 'used_count', 'created_at')


