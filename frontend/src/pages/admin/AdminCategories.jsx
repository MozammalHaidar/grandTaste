import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/helpers'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', is_active: true
  })
  const [imageFile, setImageFile] = useState(null)

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/products/admin/categories/')
      setCategories(data.results || data)
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCategories() }, [])

  const openAdd = () => {
    setEditing(null)
    setFormData({ name: '', slug: '', description: '', is_active: true })
    setImageFile(null)
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      is_active: cat.is_active,
    })
    setImageFile(null)
    setShowModal(true)
  }

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    const name = e.target.name
    setFormData((prev) => ({
      ...prev,
      [name]: val,
      ...(name === 'name' && !editing
        ? { slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
        : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)

      if (editing) {
        await api.patch(`/products/admin/categories/${editing.id}/`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Category updated!')
      } else {
        await api.post('/products/admin/categories/', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Category created!')
      }
      setShowModal(false)
      loadCategories()
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).forEach((msg) => toast.error(Array.isArray(msg) ? msg[0] : msg))
      else toast.error('Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will also affect products in this category.`)) return
    try {
      await api.delete(`/products/admin/categories/${id}/`)
      toast.success('Category deleted!')
      loadCategories()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Categories Management</h2>
        <button onClick={openAdd} className="btn-primary py-2 px-5 text-sm">
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-16 bg-gray-200 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))
        ) : categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden">
                {cat.image
                  ? <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                  : <span className="text-3xl">🍽️</span>
                }
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {cat.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{cat.name}</h3>
            <p className="text-xs text-gray-400 mb-1">/{cat.slug}</p>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {cat.description || 'No description'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary-500 font-medium">
                {cat.product_count} products
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input name="name" required value={formData.name}
                  onChange={handleChange} className="input-field" placeholder="e.g. Burgers" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input name="slug" required value={formData.slug}
                  onChange={handleChange} className="input-field" placeholder="e.g. burgers" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={2} value={formData.description}
                  onChange={handleChange} className="input-field resize-none"
                  placeholder="Short description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input type="file" accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="input-field text-sm py-2" />
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

export default AdminCategories