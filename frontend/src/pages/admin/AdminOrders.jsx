import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUS_CHOICES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const loadOrders = async () => {
    try {
      const params = filter ? { status: filter } : {}
      const { data } = await api.get('/admin/orders/', { params })
      setOrders(data.results || data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [filter])

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/`, { status })
      toast.success('Order status updated!')
      loadOrders()
      setSelectedOrder(null)
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-48 py-2 text-sm">
          <option value="">All Status</option>
          {STATUS_CHOICES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order', 'Customer', 'Phone', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-gray-800">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.full_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.items?.length}</td>
                  <td className="px-4 py-3 text-sm font-bold text-primary-500">৳{order.total}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{order.payment_method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-400">
                      {STATUS_CHOICES.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders