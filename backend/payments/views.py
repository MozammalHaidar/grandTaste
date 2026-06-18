from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.conf import settings
from django.shortcuts import redirect
from orders.models import Order
from sslcommerz_lib import SSLCOMMERZ as SSLCZ
SSLCOMMERZ = SSLCZ
import uuid


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

        sslcz = SSLCOMMERZ(settings_data)

        post_body = {
            'total_amount': float(order.total),
            'currency': 'BDT',
            'tran_id': transaction_id,
            'success_url': 'http://localhost:8000/api/payments/success/',
            'fail_url': 'http://localhost:8000/api/payments/fail/',
            'cancel_url': 'http://localhost:8000/api/payments/cancel/',
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
        tran_id = request.data.get('tran_id', '')
        status_value = request.data.get('status', '')

        if status_value == 'VALID' and tran_id:
            try:
                order_id = tran_id.split('-')[1]
                order = Order.objects.get(id=order_id)
                order.payment_status = True
                order.status = 'confirmed'
                order.save()
                return redirect(f'http://localhost:5173/orders/{order.id}?payment=success')
            except (Order.DoesNotExist, IndexError):
                pass

        return redirect('http://localhost:5173/payment-failed')


class PaymentFailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        tran_id = request.data.get('tran_id', '')
        if tran_id:
            try:
                order_id = tran_id.split('-')[1]
                return redirect(f'http://localhost:5173/orders/{order_id}?payment=failed')
            except (IndexError, Exception):
                pass
        return redirect('http://localhost:5173/payment-failed')


class PaymentCancelView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        tran_id = request.data.get('tran_id', '')
        if tran_id:
            try:
                order_id = tran_id.split('-')[1]
                return redirect(f'http://localhost:5173/orders/{order_id}?payment=cancelled')
            except (IndexError, Exception):
                pass
        return redirect('http://localhost:5173/payment-failed')


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
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
