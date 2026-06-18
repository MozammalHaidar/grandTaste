import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import api from '../api/axios'
import SEO from '../components/SEO'
import { SkeletonOrderDetail } from '../components/ui/Skeleton'


const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

const STATUS_INFO = {
  pending:          { label: 'Order Placed',     icon: '📋', color: 'text-yellow-500', bg: 'bg-yellow-50',  border: 'border-yellow-200', desc: 'Your order has been received' },
  confirmed:        { label: 'Confirmed',         icon: '✅', color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-200',   desc: 'Restaurant confirmed your order' },
  preparing:        { label: 'Preparing',         icon: '👨‍🍳', color: 'text-orange-500', bg: 'bg-orange-50',  border: 'border-orange-200', desc: 'Chef is preparing your food' },
  out_for_delivery: { label: 'Out for Delivery',  icon: '🚴', color: 'text-purple-500', bg: 'bg-purple-50',  border: 'border-purple-200', desc: 'Rider is on the way to you' },
  delivered:        { label: 'Delivered',         icon: '🎉', color: 'text-green-500',  bg: 'bg-green-50',   border: 'border-green-200',  desc: 'Enjoy your meal!' },
  cancelled:        { label: 'Cancelled',         icon: '❌', color: 'text-red-500',    bg: 'bg-red-50',     border: 'border-red-200',    desc: 'Order was cancelled' },
}

const STATUS_COLORS = {
  pending:          'bg-yellow-100 text-yellow-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
}

const OrderDetailPage = () => {
  const { id } = useParams()
  const { accessToken } = useSelector((state) => state.auth)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [countdown, setCountdown] = useState(30)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadOrder = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setIsRefreshing(true)
    try {
      const { data } = await api.get(`/orders/${id}/`)
      setOrder(data)
      setLastUpdated(new Date())
      setCountdown(30)
    } catch {
      setOrder(null)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [id])

  // Initial load
  useEffect(() => {
    if (accessToken) loadOrder()
  }, [id, accessToken, loadOrder])

  // Auto refresh every 30 seconds if order is not delivered/cancelled
  useEffect(() => {
    if (!order) return
    if (['delivered', 'cancelled'].includes(order.status)) return

    const interval = setInterval(() => {
      loadOrder(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [order, loadOrder])

  // Countdown timer
  useEffect(() => {
    if (!order) return
    if (['delivered', 'cancelled'].includes(order.status)) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 30
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [order])


  if (loading) return (
    <Layout>
      <SkeletonOrderDetail />
    </Layout>
  )

  if (!order) return (
    <Layout>
      <div className="container-custom py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Order not found</h2>
        <Link to="/orders" className="btn-primary">My Orders</Link>
      </div>
    </Layout>
  )

  const statusInfo = STATUS_INFO[order.status]
  const currentStep = STATUS_STEPS.indexOf(order.status)

  // Estimated delivery time
  const orderTime = new Date(order.created_at)
  const estimatedDelivery = new Date(orderTime.getTime() + 30 * 60000)
  const now = new Date()
  const minutesLeft = Math.max(0, Math.round((estimatedDelivery - now) / 60000))

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-BD', {
  year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'
})

  return (
    <Layout>

      <SEO
        title={`Order #${order?.id}`}
        description="Track your order in real-time. Hot food on the way!"
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-10">
        <div className="container-custom">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-white">
              <h1 className="text-3xl font-bold text-white">Order #{order.id}</h1>
              <p className="text-orange-100 mt-1">Placed on {formattedDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${STATUS_COLORS[order.status]}`}>
                {statusInfo.icon} {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">

        {/* Success Banner */}
        <AnimatePresence>
          {order.status === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center"
            >
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-green-800 mb-1">Order Placed Successfully!</h2>
              <p className="text-green-600">We've received your order and will confirm it shortly.</p>
            </motion.div>
          )}

          {order.status === 'delivered' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center"
            >
              <div className="text-5xl mb-3">😋</div>
              <h2 className="text-xl font-bold text-green-800 mb-1">Delivered! Enjoy your meal!</h2>
              <p className="text-green-600">Hope you love it. Don't forget to leave a review!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Tracking Card */}
        {order.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-gray-100"
          >
            {/* Tracking Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Live Order Tracking</h3>
                {lastUpdated && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Auto refresh indicator */}
                {!['delivered', 'cancelled'].includes(order.status) && (
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <span className="text-xs text-green-600 font-medium">
                      Live • Refreshes in {countdown}s
                    </span>
                  </div>
                )}
                {/* Manual refresh */}
                <button
                  onClick={() => loadOrder(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-500 transition-colors font-medium bg-gray-50 hover:bg-primary-50 px-3 py-1.5 rounded-full">
                  <motion.span
                    animate={isRefreshing ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0 }}
                  >
                    🔄
                  </motion.span>
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Current Status Banner */}
            <motion.div
              key={order.status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${statusInfo.bg} ${statusInfo.border} border rounded-2xl p-4 mb-6 flex items-center gap-4`}
            >
              <div className="text-4xl">{statusInfo.icon}</div>
              <div>
                <p className={`font-bold text-lg ${statusInfo.color}`}>{statusInfo.label}</p>
                <p className="text-gray-600 text-sm">{statusInfo.desc}</p>
                {order.status === 'out_for_delivery' && minutesLeft > 0 && (
                  <p className="text-purple-600 text-xs font-medium mt-1">
                    🕐 Estimated arrival in ~{minutesLeft} minutes
                  </p>
                )}
              </div>
            </motion.div>

            {/* Progress Steps */}
            <div className="relative">
              {/* Progress Line Background */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 rounded-full hidden sm:block" />
              {/* Progress Line Fill */}
              <motion.div
                className="absolute top-6 left-6 h-1 bg-primary-500 rounded-full hidden sm:block"
                initial={{ width: '0%' }}
                animate={{
                  width: currentStep >= 0
                    ? `${(currentStep / (STATUS_STEPS.length - 1)) * (100 - 12)}%`
                    : '0%'
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              <div className="relative grid grid-cols-5 gap-2">
                {STATUS_STEPS.map((step, i) => {
                  const info = STATUS_INFO[step]
                  const isCompleted = i < currentStep
                  const isCurrent = i === currentStep
                  const isPending = i > currentStep

                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      {/* Step Circle */}
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{
                          scale: isCurrent ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: isCurrent ? Infinity : 0,
                          repeatType: 'reverse'
                        }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-2 transition-all z-10 relative
                          ${isCompleted ? 'bg-primary-500 border-primary-500 shadow-md' : ''}
                          ${isCurrent ? 'bg-primary-500 border-primary-400 shadow-lg shadow-primary-200' : ''}
                          ${isPending ? 'bg-white border-gray-200' : ''}
                        `}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className={isPending ? 'grayscale opacity-40' : ''}>{info.icon}</span>
                        )}
                      </motion.div>

                      {/* Step Label */}
                      <p className={`text-xs font-medium text-center leading-tight
                        ${isCompleted || isCurrent ? 'text-primary-600' : 'text-gray-400'}
                      `}>
                        {info.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        🍽️
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-400">
                          ৳{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-800">৳{item.subtotal}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Delivery Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Full Name</p>
                  <p className="font-medium text-gray-800">{order.full_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Phone</p>
                  <p className="font-medium text-gray-800">{order.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 mb-1">Address</p>
                  <p className="font-medium text-gray-800">{order.address}, {order.city}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-800 capitalize">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Payment Status</p>
                  <p className={`font-medium ${order.payment_status ? 'text-green-500' : 'text-yellow-500'}`}>
                    {order.payment_status ? '✅ Paid' : '⏳ Pending'}
                  </p>
                </div>
                {order.note && (
                  <div className="col-span-2">
                    <p className="text-gray-400 mb-1">Order Note</p>
                    <p className="font-medium text-gray-800">{order.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Price Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal}</span>
                </div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-৳{order.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>
                    {Number(order.delivery_charge) === 0
                      ? <span className="text-green-500 font-medium">FREE 🎉</span>
                      : `৳${order.delivery_charge}`
                    }
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-500 text-xl">৳{order.total}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {order.status === 'delivered' && (
                  <Link to={`/product/${order.items[0]?.product?.slug}`}
                    className="btn-primary w-full text-center py-2.5 text-sm block">
                    Leave a Review ⭐
                  </Link>
                )}
                <Link to="/orders"
                  className="btn-outline w-full text-center py-2.5 text-sm block">
                  View All Orders
                </Link>
                <Link to="/menu"
                  className="block text-center text-sm text-primary-500 hover:underline font-medium">
                  Order Again 🍔
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OrderDetailPage