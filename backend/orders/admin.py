from django.contrib import admin
from .models import Cart, CartItem, Wishlist, Coupon, Order, OrderItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'total')
    inlines = [CartItemInline]


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user',)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percent', 'is_active', 'used_count', 'max_uses')
    list_editable = ('is_active',)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'subtotal')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'payment_status')
    list_editable = ('status',)
    inlines = [OrderItemInline]
    readonly_fields = ('subtotal', 'discount_amount', 'delivery_charge', 'total')
