import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { addToCart } from '../store/cartSlice'
import { toggleWishlist, fetchWishlist } from '../store/wishlistSlice'
import { getImageUrl } from '../utils/helpers'
import { useCartDrawer } from '../context/CartDrawerContext'

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star}
        className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const QuickViewModal = ({ product, onClose }) => {
  const dispatch = useDispatch()
  const { accessToken } = useSelector((state) => state.auth)
  const { products: wishlistProducts } = useSelector((state) => state.wishlist)
  const { openCart } = useCartDrawer()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const isWished = wishlistProducts?.some((p) => p.id === product?.id)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleAddToCart = async () => {
    if (!accessToken) {
      toast.error('Please login to add to cart')
      return
    }
    setAdding(true)
    const result = await dispatch(addToCart({ product_id: product.id, quantity }))
    if (addToCart.fulfilled.match(result)) {
      toast.success(`${quantity}x ${product.name} added to cart! 🛒`)
      onClose()
      openCart()
    } else {
      toast.error('Failed to add to cart')
    }
    setAdding(false)
  }

  const handleWishlist = async () => {
    if (!accessToken) {
      toast.error('Please login to use wishlist')
      return
    }
    const result = await dispatch(toggleWishlist(product.id))
    if (toggleWishlist.fulfilled.match(result)) {
      dispatch(fetchWishlist())
      toast.success(result.payload.wishlisted ? 'Added to wishlist ❤️' : 'Removed from wishlist')
    }
  }

  if (!product) return null

  const imageUrl = getImageUrl(product.image)
  const foodEmojis = {
    burgers: '🍔', pizza: '🍕', chicken: '🍗',
    drinks: '🥤', fries: '🍟', tacos: '🌮'
  }
  const emoji = foodEmojis[product.category_name?.toLowerCase()] || '🍽️'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 hover:shadow-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left — Image */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 h-64 md:h-full min-h-[280px] flex items-center justify-center relative overflow-hidden">
              {imageUrl ? (
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="text-[100px] select-none"
                >
                  {emoji}
                </motion.span>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.is_featured && (
                  <span className="bg-primary-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    ⭐ Featured
                  </span>
                )}
                {product.discount_price && (
                  <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className={`absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 text-lg ${
                  isWished ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                }`}>
                {isWished ? '❤️' : '♡'}
              </button>
            </div>

            {/* Right — Details */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                {/* Category + Name */}
                <p className="text-primary-500 font-medium text-sm mb-1">
                  {product.category_name}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.average_rating} />
                  <span className="font-semibold text-gray-700 text-sm">
                    {product.average_rating}
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({product.review_count} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary-500">
                    ৳{product.final_price}
                  </span>
                  {product.discount_price && (
                    <span className="text-gray-400 line-through text-sm">
                      ৳{product.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {product.description}
                  </p>
                )}

                {/* Meta */}
                <div className="flex gap-3 mb-5">
                  <div className="bg-orange-50 rounded-xl px-3 py-2 text-center flex-1">
                    <p className="text-xs text-gray-400">Prep Time</p>
                    <p className="font-bold text-gray-800 text-sm">
                      ⏱ {product.preparation_time} min
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl px-3 py-2 text-center flex-1">
                    <p className="text-xs text-gray-400">Availability</p>
                    <p className={`font-bold text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? `✅ ${product.stock} left` : '❌ Sold Out'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              {product.stock > 0 ? (
                <div className="space-y-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-gray-700">Qty:</p>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 hover:bg-gray-100 text-gray-600 font-bold transition-colors">
                        −
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-9 h-9 hover:bg-gray-100 text-gray-600 font-bold transition-colors">
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="btn-primary w-full py-3">
                    {adding ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Adding...
                      </span>
                    ) : `Add to Cart — ৳${Number(product.final_price) * quantity}`}
                  </button>

                  {/* View Full Details */}
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="block text-center text-sm text-gray-400 hover:text-primary-500 transition-colors font-medium">
                    View Full Details →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-xl py-3 text-center text-gray-500 font-medium">
                    Out of Stock
                  </div>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="block text-center text-sm text-primary-500 hover:underline font-medium">
                    View Full Details →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default QuickViewModal