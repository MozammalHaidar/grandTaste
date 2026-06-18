import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/ui/EmptyState'
import SEO from '../components/SEO'
import { fetchProducts, fetchCategories } from '../store/productSlice'
import { getImageUrl, getFoodEmoji } from '../utils/helpers'

// ─── Constants ───────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: '',          label: 'Default' },
  { value: '-created_at', label: 'Newest First' },
  { value: 'price',    label: 'Price: Low to High' },
  { value: '-price',   label: 'Price: High to Low' },
  { value: 'name',     label: 'Name A–Z' },
]

// ─── Pagination ───────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-500 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium">
        ← Prev
      </button>
      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">
              ...
            </span>
          ) : (
            <button key={i} onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-xl font-semibold transition text-sm ${
                page === p
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200 hover:text-primary-500'
              }`}>
              {p}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-500 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium">
        Next →
      </button>
      {totalPages > 1 && (
        <p className="w-full text-center text-xs text-gray-400 mt-1">
          Page {page} of {totalPages}
        </p>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
const MenuPage = () => {
  const dispatch = useDispatch()
  const { items: products, categories, loading, totalCount } = useSelector((state) => state.products)
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [ordering, setOrdering] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  const fetchWithFilters = useCallback(() => {
    dispatch(fetchProducts({
      page, ordering,
      ...(search && { search }),
      ...(selectedCategory && { category: selectedCategory }),
      ...(priceRange.min && { min_price: priceRange.min }),
      ...(priceRange.max && { max_price: priceRange.max }),
    }))
  }, [dispatch, search, selectedCategory, priceRange, ordering, page])

  useEffect(() => {
    const timer = setTimeout(fetchWithFilters, 400)
    return () => clearTimeout(timer)
  }, [fetchWithFilters])

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setOrdering('')
    setPage(1)
  }

  const hasActiveFilters = search || selectedCategory || priceRange.min || priceRange.max || ordering
  const totalPages = Math.ceil(totalCount / 12)

  return (
    <Layout>
      <SEO title="Our Menu" description="Browse 50+ delicious menu items." />

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Our Menu 🍔</h1>
              <p className="text-gray-400 text-sm mt-1">
                {loading ? 'Loading...' : `${totalCount} delicious items available`}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search your favorite food..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button onClick={() => { setSearch(''); setPage(1) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-6">

          {/* ── Sidebar — Desktop ─────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button onClick={handleClearFilters}
                    className="text-xs text-red-400 hover:text-red-600 transition font-medium">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Category
                </h4>
                <div className="flex flex-col gap-1">
                  <button onClick={() => handleCategoryClick('')}
                    className={`text-left text-sm px-3 py-2.5 rounded-xl transition flex items-center justify-between ${
                      !selectedCategory
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    🍽️ All Items
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => handleCategoryClick(cat.slug)}
                      className={`text-left text-sm px-3 py-2.5 rounded-xl transition flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      <span>{cat.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === cat.slug
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.product_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Price Range (৳)
                </h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => { setPriceRange(p => ({ ...p, min: e.target.value })); setPage(1) }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                  <input type="number" placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => { setPriceRange(p => ({ ...p, max: e.target.value })); setPage(1) }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Sort By
                </h4>
                <div className="flex flex-col gap-1 rounded-sm">
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => { setOrdering(opt.value); setPage(1) }}
                      className={`text-left text-sm px-3 py-2.5 rounded-xl transition ${
                        ordering === opt.value
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main Content ──────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-2xl shadow-sm px-4 py-3 flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile Filter Toggle */}
                <button onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-xl transition ${
                    showFilters || hasActiveFilters
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:text-primary-500 border border-gray-200'
                  }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </button>

                {/* Active Filter Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="flex items-center gap-1 bg-primary-50 text-primary-600 text-xs px-3 py-1.5 rounded-full font-medium border border-primary-100">
                      {categories.find(c => c.slug === selectedCategory)?.name}
                      <button onClick={() => { setSelectedCategory(''); setPage(1) }}
                        className="ml-1 hover:text-primary-800 font-bold">✕</button>
                    </span>
                  )}
                  {search && (
                    <span className="flex items-center gap-1 bg-primary-50 text-primary-600 text-xs px-3 py-1.5 rounded-full font-medium border border-primary-100">
                      🔍 "{search}"
                      <button onClick={() => { setSearch(''); setPage(1) }}
                        className="ml-1 hover:text-primary-800 font-bold">✕</button>
                    </span>
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <span className="flex items-center gap-1 bg-primary-50 text-primary-600 text-xs px-3 py-1.5 rounded-full font-medium border border-primary-100">
                      ৳{priceRange.min || 0} – ৳{priceRange.max || '∞'}
                      <button onClick={() => { setPriceRange({ min: '', max: '' }); setPage(1) }}
                        className="ml-1 hover:text-primary-800 font-bold">✕</button>
                    </span>
                  )}
                  {hasActiveFilters && (
                    <button onClick={handleClearFilters}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition">
                      Clear All ✕
                    </button>
                  )}
                </div>
              </div>

              {/* View Mode + Sort */}
              <div className="flex items-center gap-3">
                <select value={ordering}
                  onChange={(e) => { setOrdering(e.target.value); setPage(1) }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white hidden md:block">
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* Grid/List toggle */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setViewMode('grid')}
                    className={`p-2 transition ${
                      viewMode === 'grid'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-gray-600 bg-white'
                    }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button onClick={() => setViewMode('list')}
                    className={`p-2 transition ${
                      viewMode === 'list'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-gray-600 bg-white'
                    }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white rounded-2xl shadow-sm p-5 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Category
                    </label>
                    <select value={selectedCategory}
                      onChange={(e) => { setSelectedCategory(e.target.value); setPage(1) }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                      <option value="">All</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Sort By
                    </label>
                    <select value={ordering}
                      onChange={(e) => { setOrdering(e.target.value); setPage(1) }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Min Price (৳)
                    </label>
                    <input type="number" placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => { setPriceRange(p => ({ ...p, min: e.target.value })); setPage(1) }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Max Price (৳)
                    </label>
                    <input type="number" placeholder="Any"
                      value={priceRange.max}
                      onChange={(e) => { setPriceRange(p => ({ ...p, max: e.target.value })); setPage(1) }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products Grid / List */}
            {loading ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              }>
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon="🍽️"
                title="No items found"
                desc="Try adjusting your filters or search term"
                actionLabel="Clear Filters"
                actionTo="/menu"
              />
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {products.map((product, i) => (
                      <motion.div key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {products.map((product, i) => (
                      <motion.div key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                        {/* Image */}
                        <div className="w-24 h-24 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image
                            ? <img src={getImageUrl(product.image)} alt={product.name}
                                className="w-full h-full object-cover rounded-xl" loading="lazy" />
                            : <span className="text-4xl">{getFoodEmoji(product.category_name)}</span>
                          }
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-primary-500 font-medium mb-0.5">{product.category_name}</p>
                          <h3 className="font-semibold text-gray-800 truncate mb-1">{product.name}</h3>
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, s) => (
                              <svg key={s} className={`w-3.5 h-3.5 ${s < Math.round(product.average_rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                                fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-400 ml-1">({product.review_count})</span>
                          </div>
                          <p className="text-xs text-gray-400">⏱ {product.preparation_time} min</p>
                        </div>
                        {/* Price + Stock + Cart */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="font-bold text-primary-500 text-lg">৳{product.final_price}</p>
                            {product.discount_price && (
                              <p className="text-xs text-gray-400 line-through">৳{product.price}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-500'
                          }`}>
                            {product.stock > 0 ? 'On Sale' : 'Out of Stock'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MenuPage