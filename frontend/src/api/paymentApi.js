import api from './axios'

export const initiatePayment = (order_id) =>
  api.post('/payments/initiate/', { order_id })

export const getPaymentStatus = (order_id) =>
  api.get(`/payments/status/${order_id}/`)