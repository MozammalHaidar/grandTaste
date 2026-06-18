import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl, getFoodEmoji } from '../utils/helpers'
import useCart from '../hooks/useCart'
import useWishlist from '../hooks/useWishlist'
import { useQuickView } from '../context/QuickViewContext'
import StarRating from './ui/StarRating'
import PriceTag from './ui/PriceTag'

const ProductCard = ({ product }) => {
  const { handleAddToCart } = useCart()
  const { isWished, handleToggleWishlist } = useWishlist()
  const { openQuickView } = useQuickView()

  const imageUrl = getImageUrl(product.image)
  const emoji = getFoodEmoji(product.category_name)
  const wished = isWished(product.id)

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(249,115,22,0.15)' }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.slug}`} className="card group overflow-hidden block">
        {/* Image */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 h-52 flex items-center justify-center relative overflow-hidden">
          {imageUrl
            ? <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">{emoji}</span>
          }

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.discount_price && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Sale</span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Sold Out</span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={(e) => { e.preventDefault(); handleToggleWishlist(product.id) }}
            className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors text-lg ${wished ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
            {wished ? '❤️' : '♡'}
          </button>

          {/* Quick View */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={(e) => { e.preventDefault(); openQuickView(product) }}
              className="bg-white text-gray-800 hover:bg-primary-500 hover:text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-primary-500 font-medium mb-1">{product.category_name}</p>
          <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={product.average_rating} />
            <span className="text-sm font-medium text-gray-700">{product.average_rating}</span>
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <PriceTag price={product.price} discountPrice={product.discount_price} />
              <span className="text-xs text-gray-400">{product.preparation_time} min</span>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); handleAddToCart(product.id, product.name) }}
              disabled={product.stock === 0}
              className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard