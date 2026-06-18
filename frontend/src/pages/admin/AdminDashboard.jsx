import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'

const KPICard = ({ title, value, icon, color, sub }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <span className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-xl`}>
        {icon}
      </span>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

const STATUS_COLORS = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  preparing: '#F97316',
  out_for_delivery: '#8B5CF6',
  delivered: '#22C55E',
  cancelled: '#EF4444',
}

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/analytics/')
        setAnalytics(data)
      } catch {
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <AdminLayout>
      <div className="text-center py-20 text-gray-400">Loading dashboard...</div>
    </AdminLayout>
  )

  const statusData = analytics?.orders_by_status
    ? Object.entries(analytics.orders_by_status).map(([key, val]) => ({
        name: key.replace('_', ' '),
        orders: val,
        fill: STATUS_COLORS[key],
      }))
    : []

  return (
    <AdminLayout>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value={`৳${Number(analytics?.total_revenue || 0).toLocaleString()}`}
          icon="💰" color="bg-green-100"
          sub="From delivered orders"
        />
        <KPICard
          title="Total Orders"
          value={analytics?.total_orders || 0}
          icon="📦" color="bg-blue-100"
          sub="All time"
        />
        <KPICard
          title="Customers"
          value={analytics?.total_customers || 0}
          icon="👥" color="bg-purple-100"
          sub="Registered users"
        />
        <KPICard
          title="Products"
          value={analytics?.total_products || 0}
          icon="🍔" color="bg-orange-100"
          sub="Active products"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Revenue — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics?.daily_revenue || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(val) => [`৳${val}`, 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone" dataKey="revenue"
                stroke="#F97316" strokeWidth={3}
                dot={{ fill: '#F97316', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="orders" radius={[0, 6, 6, 0]}>
                {statusData.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-primary-500 hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(analytics?.recent_orders || []).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items?.length} items</td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary-500">৳{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
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

export default AdminDashboard