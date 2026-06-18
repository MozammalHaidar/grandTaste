import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='iexact')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    min_rating = django_filters.NumberFilter(method='filter_by_rating')

    class Meta:
        model = Product
        fields = ['category', 'is_featured', 'min_price', 'max_price']

    def filter_by_rating(self, queryset, name, value):
        ids = [p.id for p in queryset if p.average_rating >= float(value)]
        return queryset.filter(id__in=ids)