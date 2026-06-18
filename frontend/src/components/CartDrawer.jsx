import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { fetchCart, updateCartItem, removeCartItem } from '../store/cartSlice'
import { getImageUrl } from '../utils/helpers'

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total, total_items, loading } = useSelector((state) => state.cart)
  const { accessToken } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isOpen && accessToken) dispatch(fetchCart())
  }, [isOpen, accessToken, dispatch])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleQuantityChange = async (item_id, quantity) => {
    if (quantity <= 0) {
      await dispatch(removeCartItem(item_id))
    } else {
      await dispatch(updateCartItem({ item_id, quantity }))
    }
  }

  const handleRemove = async (item_id, name) => {
    await dispatch(removeCartItem(item_id))
    toast.success(`${name} removed`)
  }

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  const delivery = Number(total) >= 500 ? 0 : 60
  const grandTotal = Number(total) + delivery

  const foodEmojis = {
    burgers: '🍔', pizza: '🍕', chicken: '🍗',
    drinks: '🥤', fries: '🍟', tacos: '🌮'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">My Cart</h2>
                  <p className="text-xs text-gray-400">{total_items} items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin text-3xl">⏳</div>
                </div>
              ) : !accessToken ? (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="font-bold text-gray-700 mb-2">Sign in to view cart</h3>
                  <p className="text-gray-400 text-sm mb-6">Login to start adding your favorite food</p>
                  <Link to="/login" onClick={onClose} className="btn-primary px-8 py-2.5">
                    Sign In
                  </Link>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="text-7xl mb-4"
                  >
                    🛒
                  </motion.div>
                  <h3 className="font-bold text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 text-sm mb-6">Add some delicious items to get started!</p>
                  <Link to="/menu" onClick={onClose} className="btn-primary px-8 py-2.5">
                    Browse Menu 🍔
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-4 space-y-3">
                  {/* Free delivery progress */}
                  {Number(total) < 500 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-orange-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-600 font-medium">
                          Add <span className="text-primary-500 font-bold">৳{500 - Number(total)}</span> more for free delivery!
                        </p>
                        <span className="text-xs text-gray-400">🚚</span>
                      </div>
                      <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(Number(total) / 500) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}

                  {Number(total) >= 500 && (
                    <div className="bg-green-50 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <span className="text-lg">🎉</span>
                      <p className="text-sm text-green-600 font-medium">You got free delivery!</p>
                    </div>
                  )}

                  {/* Cart Items */}
                  <AnimatePresence>
                    {items.map((item) => {
                      const imageUrl = getImageUrl(item.product.image)
                      const emoji = foodEmojis[item.product.category_name?.toLowerCase()] || '🍽️'
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm"
                        >
                          {/* Image */}
                          <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {imageUrl
                              ? <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
                              : <span className="text-2xl">{emoji}</span>
                            }
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-400 mb-1">{item.product.category_name}</p>
                            <p className="text-primary-500 font-bold text-sm">৳{item.product.final_price}</p>
                          </div>

                          {/* Quantity + Remove */}
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => handleRemove(item.id, item.product.name)}
                              className="text-gray-300 hover:text-red-400 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-7 h-7 hover:bg-gray-100 text-gray-600 font-bold transition-colors flex items-center justify-center text-sm">
                                −
                              </button>
                              <span className="w-7 text-center text-sm font-semibold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-7 h-7 hover:bg-gray-100 text-gray-600 font-bold transition-colors flex items-center justify-center text-sm">
                                +
                              </button>
                            </div>
                            <p className="text-xs font-bold text-gray-700">৳{item.subtotal}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer — Order Summary + Checkout */}
            {items.length > 0 && accessToken && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-100 px-6 py-5 bg-white space-y-4"
              >
                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({total_items} items)</span>
                    <span className="font-medium text-gray-800">৳{total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span>
                    <span className={`font-medium ${delivery === 0 ? 'text-green-500' : 'text-gray-800'}`}>
                      {delivery === 0 ? 'FREE 🎉' : `৳${delivery}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-primary-500 text-lg">৳{grandTotal}</span>
                  </div>
                </div>

                {/* Buttons */}
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-3.5 text-center">
                  Checkout → ৳{grandTotal}
                </button>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block text-center text-sm text-gray-400 hover:text-primary-500 transition-colors font-medium">
                  View Full Cart
                </Link>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer