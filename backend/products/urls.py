from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView,
    FeaturedProductsView, ReviewCreateView, ReviewListView,
    AdminProductListCreateView, AdminProductUpdateDeleteView,
    AdminCategoryCreateView, AdminCategoryUpdateDeleteView
)

urlpatterns = [
    # Public — no slug
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('', ProductListView.as_view(), name='product-list'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),

    # Admin — must come BEFORE slug patterns
    path('admin/products/', AdminProductListCreateView.as_view(), name='admin-products'),
    path('admin/products/<int:pk>/', AdminProductUpdateDeleteView.as_view(), name='admin-product-detail'),
    path('admin/categories/', AdminCategoryCreateView.as_view(), name='admin-categories'),
    path('admin/categories/<int:pk>/', AdminCategoryUpdateDeleteView.as_view(), name='admin-category-detail'),

    # Slug patterns — must come LAST
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/reviews/', ReviewListView.as_view(), name='review-list'),
    path('<slug:slug>/reviews/create/', ReviewCreateView.as_view(), name='review-create'),
]