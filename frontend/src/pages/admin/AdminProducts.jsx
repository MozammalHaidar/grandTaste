import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/helpers'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const [formData, setFormData] = useState({
  name: '',
  slug: '',
  description: '',
  price: '',
  discount_price: '',
  stock: '',
  preparation_time: 20,
  category_id: '',
  is_active: true,
  is_featured: false,
})
  // const [formData, setFormData] = useState({
  //   name: '', slug: '', description: '', price: '',
  //   discount_price: '', stock: '', preparation_time: 20,
  //   category: '', is_active: true, is_featured: false,
  // })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products/admin/products/'),
        api.get('/products/admin/categories/'),
      ])
      setProducts(prodRes.data.results || prodRes.data)
      setCategories(catRes.data.results || catRes.data)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const openAdd = () => {
    setEditing(null)

    setFormData({
  name: '',
  slug: '',
  description: '',
  price: '',
  discount_price: '',
  stock: '',
  preparation_time: 20,
  category_id: '',
  is_active: true,
  is_featured: false,
})
    // setFormData({
    //   name: '', slug: '', description: '', price: '',
    //   discount_price: '', stock: '', preparation_time: 20,
    //   category: '', is_active: true, is_featured: false,
    // })
    setImageFile(null)
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    // setFormData({
    //   name: product.name,
    //   slug: product.slug,
    //   description: product.description || '',
    //   price: product.price,
    //   discount_price: product.discount_price || '',
    //   stock: product.stock,
    //   preparation_time: product.preparation_time,
    //   category: product.category?.id || '',
    //   is_active: product.is_active,
    //   is_featured: product.is_featured,
    // })

  setFormData({
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    discount_price: product.discount_price || '',
    stock: product.stock,
    preparation_time: product.preparation_time,
    category_id: product.category?.id || '',
    is_active: product.is_active,
    is_featured: product.is_featured,
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
      ...(name === 'name' && !editing ? { slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {}),
    }))
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setSaving(true)
  //   try {
  //     const fd = new FormData()
  //     Object.entries(formData).forEach(([k, v]) => {
  //       if (v !== '' && v !== null) fd.append(k, v)
  //     })
  //     if (imageFile) fd.append('image', imageFile)

  //     if (editing) {
  //       await api.patch(`/products/admin/products/${editing.id}/`, fd, {
  //         headers: { 'Content-Type': 'multipart/form-data' }
  //       })
  //       toast.success('Product updated!')
  //     } else {
  //       await api.post('/products/admin/products/', fd, {
  //         headers: { 'Content-Type': 'multipart/form-data' }
  //       })
  //       toast.success('Product created!')
  //     }
  //     setShowModal(false)
  //     loadData()
  //   } catch (err) {
  //     const errors = err.response?.data
  //     if (errors) Object.values(errors).forEach((msg) => toast.error(Array.isArray(msg) ? msg[0] : msg))
  //     else toast.error('Failed to save product')
  //   } finally {
  //     setSaving(false)
  //   }
  // }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setSaving(true)

  try {
    const fd = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        fd.append(key, value)
      }
    })

    if (imageFile) {
      fd.append('image', imageFile)
    }

    if (editing) {
      await api.patch(
        `/products/admin/products/${editing.id}/`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      toast.success('Product updated!')
    } else {
      await api.post(
        '/products/admin/products/',
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      toast.success('Product created!')
    }

    setShowModal(false)
    loadData()
  } catch (err) {
    console.error(err.response?.data)

    const errors = err.response?.data

    if (errors) {
      Object.values(errors).forEach((msg) =>
        toast.error(Array.isArray(msg) ? msg[0] : msg)
      )
    } else {
      toast.error('Failed to save product')
    }
  } finally {
    setSaving(false)
  }
}

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.delete(`/products/admin/products/${id}/`)
      toast.success('Product deleted!')
      loadData()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Products Management</h2>
        <button onClick={openAdd} className="btn-primary py-2 px-5 text-sm">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center overflow-hidden">
                      {p.image
                        ? <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                        : <span className="text-xl">🍽️</span>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-[150px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category?.name}</td>
                  <td className="px-4 py-3 text-sm font-bold text-primary-500">৳{p.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.stock}</td>
                  <td className="px-4 py-3 text-sm">{p.is_featured ? '⭐' : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button onClick={() => openEdit(p)}
                      className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id, p.name)}
                      className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input name="name" required value={formData.name} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input name="slug" required value={formData.slug} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                      name="category_id"
                      required
                      value={formData.category_id}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  {/* <select name="category" required value={formData.category} onChange={handleChange} className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select> */}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
                  <input name="price" type="number" required value={formData.price} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (৳)</label>
                  <input name="discount_price" type="number" value={formData.discount_price} onChange={handleChange} className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input name="stock" type="number" required value={formData.stock} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input name="preparation_time" type="number" value={formData.preparation_time} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                    className="input-field text-sm py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={3} value={formData.description} onChange={handleChange}
                  className="input-field resize-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange}
                    className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange}
                    className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
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

export default AdminProducts