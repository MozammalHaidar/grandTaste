from django.urls import path
from .views import (
    CartView, CartItemView,
    WishlistView, WishlistToggleView,
    ApplyCouponView,
    OrderListCreateView, OrderDetailView,
)
from .views import AdminOrderListView, AdminOrderUpdateView, AdminAnalyticsView
from .views import AdminCouponListCreateView, AdminCouponUpdateDeleteView

urlpatterns = [
    # Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/', CartItemView.as_view(), name='cart-add'),
    path('cart/items/<int:item_id>/', CartItemView.as_view(), name='cart-item'),

    # Wishlist
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/toggle/<int:product_id>/', WishlistToggleView.as_view(), name='wishlist-toggle'),

    # Coupon
    path('coupon/apply/', ApplyCouponView.as_view(), name='apply-coupon'),

    # Orders
    path('orders/', OrderListCreateView.as_view(), name='orders'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    #Admin
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/orders/<int:pk>/', AdminOrderUpdateView.as_view(), name='admin-order-update'),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('admin/coupons/', AdminCouponListCreateView.as_view(), name='admin-coupons'),
    path('admin/coupons/<int:pk>/', AdminCouponUpdateDeleteView.as_view(), name='admin-coupon-detail'),

]
