import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import { fetchCart } from '../store/cartSlice'
import api from '../api/axios'
import { initiatePayment } from '../api/paymentApi'
import { getImageUrl, getFoodEmoji } from '../utils/helpers'
import SEO from '../components/SEO'



const CheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector((state) => state.cart)
  const { user, accessToken } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    full_name: user ? `${user.first_name} ${user.last_name}` : '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    payment_method: 'cod',
    note: '',
  })
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  useEffect(() => {
    if (accessToken) dispatch(fetchCart())
  }, [dispatch, accessToken])

  const delivery = total >= 2500 ? 0 : 60
  const discountAmount = coupon ? Math.round(Number(total) * coupon.discount_percent / 100) : 0
  const grandTotal = Number(total) - discountAmount + delivery

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await api.post('/coupon/apply/', { code: couponCode })
      setCoupon(data)
      toast.success(`Coupon applied! ${data.discount_percent}% off 🎉`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid coupon')
      setCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }
    setOrderLoading(true)
    try {
      // Step 1 — Create the order
      const { data: order } = await api.post('/orders/', {
        ...formData,
        coupon_code: couponCode,
      })

      // Step 2 — If card or mobile banking → redirect to SSLCommerz
      if (formData.payment_method !== 'cod') {
        try {
          toast.loading('Redirecting to payment...', { id: 'payment' })
          const { data: payment } = await initiatePayment(order.id)
          if (payment.payment_url) {
            toast.dismiss('payment')
            window.location.href = payment.payment_url
            return
          } else {
            toast.error('Could not get payment URL. Please try COD.', { id: 'payment' })
            navigate(`/orders/${order.id}`)
            return
          }
        } catch (payErr) {
          toast.error('Payment gateway error. Please try COD.', { id: 'payment' })
          navigate(`/orders/${order.id}`)
          return
        }
      }

      // Step 3 — COD goes directly to order page
      toast.success('Order placed successfully! 🎉')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        Object.values(errors).forEach((msg) =>
          toast.error(Array.isArray(msg) ? msg[0] : msg)
        )
      } else {
        toast.error('Failed to place order')
      }
    } finally {
      setOrderLoading(false)
    }
  }

  if (!accessToken) return (
    <Layout>
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Please login to checkout</h2>
        <Link to="/login" className="btn-primary px-8">Sign In</Link>
      </div>
    </Layout>
  )

  return (
    <Layout>

      <SEO
        title="Checkout"
        description="Complete your order securely. Pay with bKash, Nagad, or card via SSLCommerz."
      />
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-10">
        <div className="container-custom text-white">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="text-orange-100 mt-1">Complete your order</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left — Delivery + Payment */}
            <div className="lg:col-span-2 space-y-6">

              {/* Delivery Info */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-5">🚚 Delivery Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="full_name" required
                      value={formData.full_name} onChange={handleChange}
                      className="input-field" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="text" name="phone" required
                      value={formData.phone} onChange={handleChange}
                      className="input-field" placeholder="+880 1700-000000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                    <textarea name="address" required rows={2}
                      value={formData.address} onChange={handleChange}
                      className="input-field resize-none" placeholder="House #, Road #, Area..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input type="text" name="city" required
                      value={formData.city} onChange={handleChange}
                      className="input-field" placeholder="Dhaka" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Note (optional)</label>
                    <input type="text" name="note"
                      value={formData.note} onChange={handleChange}
                      className="input-field" placeholder="Extra spicy, no onion..." />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-2">💳 Payment Method</h3>
                <p className="text-xs text-gray-400 mb-5">
                  Card and Mobile Banking payments are processed securely via SSLCommerz
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: '💵', badge: null },
                    { value: 'card', label: 'Credit/Debit Card', icon: '💳', badge: 'SSLCommerz' },
                    { value: 'mobile', label: 'bKash / Nagad', icon: '📱', badge: 'SSLCommerz' },
                  ].map((method) => (
                    <label key={method.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                        formData.payment_method === method.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}>
                      <input type="radio" name="payment_method"
                        value={method.value}
                        checked={formData.payment_method === method.value}
                        onChange={handleChange}
                        className="accent-primary-500" />
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{method.label}</span>
                      {method.badge && (
                        <span className="absolute top-1.5 right-2 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
                          {method.badge}
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* SSLCommerz info banner */}
                {formData.payment_method !== 'cod' && (
                  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Secure Payment via SSLCommerz</p>
                      <p className="text-xs text-blue-500 mt-0.5">
                        Supports bKash, Nagad, Rocket, Visa, Mastercard & more
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4">🛒 Order Items</h3>
                <div className="space-y-3">
                  {items.map((item) => {
                    const imageUrl = getImageUrl(item.product.image)
                    const emoji = getFoodEmoji(item.product.category_name)

                    return (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {imageUrl
                              ? <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                              : <span className="text-lg">{emoji}</span>
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-400">x{item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">৳{item.subtotal}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right — Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24 space-y-5">
                <h3 className="font-bold text-gray-800 text-lg">Order Summary</h3>

                {/* Coupon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="input-field text-sm flex-1"
                    />
                    <button type="button" onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="btn-outline py-2 px-4 text-sm flex-shrink-0">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {coupon && (
                    <p className="text-green-600 text-xs mt-2 font-medium">
                      ✅ {coupon.discount_percent}% discount applied!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{total}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount ({coupon.discount_percent}%)</span>
                      <span>-৳{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-green-500 font-medium' : ''}>
                      {delivery === 0 ? 'FREE' : `৳${delivery}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-500 text-xl">৳{grandTotal}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button type="submit"
                  disabled={orderLoading || items.length === 0}
                  className="btn-primary w-full py-4 text-lg">
                  {orderLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      {formData.payment_method === 'cod'
                        ? 'Placing Order...'
                        : 'Redirecting to Payment...'}
                    </span>
                  ) : formData.payment_method === 'cod'
                    ? 'Place Order 🎉'
                    : `Pay ৳${grandTotal} via SSLCommerz 💳`
                  }
                </button>

                <Link to="/cart"
                  className="block text-center text-sm text-primary-500 hover:underline">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default CheckoutPage