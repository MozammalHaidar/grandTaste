from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductListSerializer,
    ProductDetailSerializer, ReviewSerializer
)
from .filters import ProductFilter

from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductListSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = ProductFilter
    search_fields = ('name', 'description', 'category__name')
    ordering_fields = ('price', 'created_at', 'name')
    ordering = ('-created_at',)


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'slug'


class FeaturedProductsView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True, is_featured=True)
    serializer_class = ProductListSerializer
    permission_classes = (permissions.AllowAny,)


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        product = Product.objects.get(slug=self.kwargs['slug'])
        if Review.objects.filter(product=product, user=self.request.user).exists():
            raise Exception('You have already reviewed this product')
        serializer.save(user=self.request.user, product=product)


class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        return Review.objects.filter(product__slug=self.kwargs['slug'])


class AdminProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().select_related('category')
    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        return ProductDetailSerializer

    def perform_create(self, serializer):
        serializer.save()


class AdminProductUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProductDetailSerializer


# class AdminCategoryCreateView(generics.ListCreateAPIView):
#     queryset = Category.objects.all()
#     permission_classes = (IsAdminUser,)
#     serializer_class = CategorySerializer

class AdminCategoryCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    permission_classes = (IsAdminUser,)
    serializer_class = CategorySerializer
    parser_classes = (MultiPartParser, FormParser)


# class AdminCategoryUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Category.objects.all()
#     permission_classes = (IsAdminUser,)
#     serializer_class = CategorySerializer

class AdminCategoryUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    permission_classes = (IsAdminUser,)
    serializer_class = CategorySerializer
    parser_classes = (MultiPartParser, FormParser)