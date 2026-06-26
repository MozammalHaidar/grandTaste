from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.conf import settings
from django.shortcuts import redirect
from orders.models import Order
from sslcommerz_lib import SSLCOMMERZ
import uuid


def get_frontend_url():
    """Returns the configured frontend URL, falling back to localhost for local dev."""
    return getattr(settings, 'FRONTEND_URL', None) or 'http://localhost:5173'


def get_backend_url():
    """Returns the configured backend URL, falling back to localhost for local dev."""
    return getattr(settings, 'BACKEND_URL', None) or 'http://127.0.0.1:8000'


def extract_order_id(tran_id):
    """Extracts the order ID from a transaction ID like 'FF-42-A1B2C3D4'."""
    try:
        return tran_id.split('-')[1]
    except (IndexError, AttributeError):
        return None


class InitiatePaymentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.payment_status:
            return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)

        transaction_id = f"FF-{order.id}-{uuid.uuid4().hex[:8].upper()}"

        settings_data = {
            'store_id': settings.SSLCOMMERZ_STORE_ID,
            'store_pass': settings.SSLCOMMERZ_STORE_PASSWORD,
            'issandbox': settings.SSLCOMMERZ_IS_SANDBOX,
        }

        backend_url = get_backend_url()
        sslcz = SSLCOMMERZ(settings_data)

        post_body = {
            'total_amount': float(order.total),
            'currency': 'BDT',
            'tran_id': transaction_id,
            'success_url': f'{backend_url}/api/payments/success/',
            'fail_url': f'{backend_url}/api/payments/fail/',
            'cancel_url': f'{backend_url}/api/payments/cancel/',
            'emi_option': 0,
            'cus_name': order.full_name,
            'cus_email': request.user.email,
            'cus_phone': order.phone,
            'cus_add1': order.address,
            'cus_city': order.city,
            'cus_country': 'Bangladesh',
            'shipping_method': 'NO',
            'multi_card_name': '',
            'num_of_item': order.items.count(),
            'product_name': f'GrandTaste Order #{order.id}',
            'product_category': 'Food',
            'product_profile': 'general',
        }

        response = sslcz.createSession(post_body)

        if response.get('status') == 'SUCCESS':
            order.note = f"{order.note} | TXN:{transaction_id}"
            order.save()
            return Response({
                'payment_url': response['GatewayPageURL'],
                'transaction_id': transaction_id,
            })
        else:
            return Response(
                {'error': 'Failed to initiate payment', 'details': response},
                status=status.HTTP_400_BAD_REQUEST
            )


class PaymentSuccessView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        frontend_url = get_frontend_url()
        status_value = request.data.get('status', '')
        order_id = extract_order_id(request.data.get('tran_id', ''))

        if status_value == 'VALID' and order_id:
            try:
                order = Order.objects.get(id=order_id)
                order.payment_status = True
                order.status = 'confirmed'
                order.save()
                return redirect(f'{frontend_url}/orders/{order.id}?payment=success')
            except Order.DoesNotExist:
                pass

        return redirect(f'{frontend_url}/payment-failed')


class PaymentFailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        frontend_url = get_frontend_url()
        order_id = extract_order_id(request.data.get('tran_id', ''))

        if order_id:
            return redirect(f'{frontend_url}/orders/{order_id}?payment=failed')
        return redirect(f'{frontend_url}/payment-failed')


class PaymentCancelView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        frontend_url = get_frontend_url()
        order_id = extract_order_id(request.data.get('tran_id', ''))

        if order_id:
            return redirect(f'{frontend_url}/orders/{order_id}?payment=cancelled')
        return redirect(f'{frontend_url}/payment-failed')


class PaymentStatusView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            return Response({
                'order_id': order.id,
                'payment_status': order.payment_status,
                'order_status': order.status,
                'total': str(order.total),
            })
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
