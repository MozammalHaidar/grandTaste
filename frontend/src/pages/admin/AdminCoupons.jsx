import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    code: '', discount_percent: '', min_order_amount: 0,
    max_uses: 100, is_active: true, expires_at: ''
  })

  const loadCoupons = async () => {
    try {
      const { data } = await api.get('/admin/coupons/')
      setCoupons(data.results || data)
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCoupons() }, [])

  const openAdd = () => {
    setEditing(null)
    setFormData({
      code: '', discount_percent: '', min_order_amount: 0,
      max_uses: 100, is_active: true, expires_at: ''
    })
    setShowModal(true)
  }

  const openEdit = (coupon) => {
    setEditing(coupon)
    setFormData({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      min_order_amount: coupon.min_order_amount,
      max_uses: coupon.max_uses,
      is_active: coupon.is_active,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: val })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...formData, code: formData.code.toUpperCase() }
      if (!payload.expires_at) delete payload.expires_at

      if (editing) {
        await api.patch(`/admin/coupons/${editing.id}/`, payload)
        toast.success('Coupon updated!')
      } else {
        await api.post('/admin/coupons/', payload)
        toast.success('Coupon created!')
      }
      setShowModal(false)
      loadCoupons()
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).forEach((msg) => toast.error(Array.isArray(msg) ? msg[0] : msg))
      else toast.error('Failed to save coupon')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return
    try {
      await api.delete(`/admin/coupons/${id}/`)
      toast.success('Coupon deleted!')
      loadCoupons()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Coupons Management</h2>
        <button onClick={openAdd} className="btn-primary py-2 px-5 text-sm">
          + Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Code', 'Discount', 'Min Order', 'Uses', 'Expires', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No coupons yet</td></tr>
              ) : coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-primary-500 bg-primary-50 px-3 py-1 rounded-lg text-sm">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">{c.discount_percent}% OFF</td>
                  <td className="px-4 py-3 text-sm text-gray-600">৳{c.min_order_amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.used_count}/{c.max_uses}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'No expiry'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button onClick={() => openEdit(c)}
                      className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c.id, c.code)}
                      className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input name="code" required value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="input-field font-mono" placeholder="e.g. SAVE20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount % *</label>
                  <input name="discount_percent" type="number" required min="1" max="100"
                    value={formData.discount_percent} onChange={handleChange}
                    className="input-field" placeholder="e.g. 20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (৳)</label>
                  <input name="min_order_amount" type="number" min="0"
                    value={formData.min_order_amount} onChange={handleChange}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input name="max_uses" type="number" min="1"
                    value={formData.max_uses} onChange={handleChange}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                  <input name="expires_at" type="datetime-local"
                    value={formData.expires_at} onChange={handleChange}
                    className="input-field text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={formData.is_active}
                  onChange={handleChange} className="w-4 h-4 accent-primary-500" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCoupons