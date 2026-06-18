import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonOrderCard } from '../components/ui/Skeleton'
import useAuth from '../hooks/useAuth'
import api from '../api/axios'
import { formatDate } from '../utils/helpers'

// ─── Order Card ──────────────────────────────────────────────
const OrderCard = ({ order }) => (
  <div className="card p-5 flex items-center justify-between gap-4 flex-wrap
    hover:shadow-md transition-shadow duration-200">

    {/* Left */}
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center
        justify-center text-2xl flex-shrink-0">
        📦
      </div>
      <div>
        <p className="font-bold text-gray-800">Order #{order.id}</p>
        <p className="text-sm text-gray-400">{formatDate(order.created_at)}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {order.items?.length} items • {order.payment_method?.toUpperCase()}
        </p>
      </div>
    </div>

    {/* Right */}
    <div className="flex items-center gap-4 flex-wrap">
      <StatusBadge status={order.status} />
      <p className="font-bold text-primary-500 text-lg">৳{order.total}</p>
      <Link to={`/orders/${order.id}`} className="btn-outline py-2 px-4 text-sm">
        View Details →
      </Link>
    </div>
  </div>
)

// ─── Main Page ───────────────────────────────────────────────
const OrdersPage = () => {
  const { accessToken } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/orders/')
        setOrders(data.results || data)
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) load()
  }, [accessToken])

  return (
    <Layout>
      <PageHeader
        title="My Orders"
        subtitle={loading ? 'Loading...' : `${orders.length} orders total`}
      />

      <div className="container-custom py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <SkeletonOrderCard key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            desc="Your order history will appear here"
            actionLabel="Order Now 🍔"
            actionTo="/menu"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default OrdersPage