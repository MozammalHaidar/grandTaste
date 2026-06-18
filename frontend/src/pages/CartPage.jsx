import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import PriceTag from '../components/ui/PriceTag'
import useAuth from '../hooks/useAuth'
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../store/cartSlice'
import { getImageUrl, getFoodEmoji, getDeliveryCharge, getGrandTotal } from '../utils/helpers'
import { SkeletonCartItem } from '../components/ui/Skeleton'

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { items, total, total_items, loading } = useSelector((state) => state.cart)

  const delivery = getDeliveryCharge(total)
  const grandTotal = getGrandTotal(total)

  useEffect(() => {
    if (accessToken) dispatch(fetchCart())
  }, [dispatch, accessToken])

  const handleQuantityChange = async (item_id, quantity) => {
    await dispatch(updateCartItem({ item_id, quantity }))
  }

  const handleRemove = async (item_id, name) => {
    await dispatch(removeCartItem(item_id))
    toast.success(`${name} removed from cart`)
  }

  const handleClear = async () => {
    await dispatch(clearCart())
    toast.success('Cart cleared')
  }

  if (!accessToken) return (
    <Layout>
      <EmptyState
        icon="🛒"
        title="Please login to view your cart"
        desc="Sign in to start ordering your favorite food"
        actionLabel="Sign In"
        actionTo="/login"
      />
    </Layout>
  )

  return (
    <Layout>
      <PageHeader
        title="My Cart"
        subtitle={`${total_items} items in your cart`}
      />

      <div className="container-custom py-8">
        {loading ? (
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonCartItem key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            desc="Add some delicious items to get started!"
            actionLabel="Browse Menu 🍔"
            actionTo="/menu"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-800">Order Items</h2>
                <button onClick={handleClear}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
                  Clear All
                </button>
              </div>

              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Order Summary */}
            <OrderSummary
              total={total}
              total_items={total_items}
              delivery={delivery}
              grandTotal={grandTotal}
              onCheckout={() => navigate('/checkout')}
            />
          </div>
        )}
      </div>
    </Layout>
  )
}

// ─── Cart Item ─────────────────────────────────────────────
const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const imageUrl = getImageUrl(item.product.image)
  const emoji = getFoodEmoji(item.product.category_name)

  return (
    <div className="card p-4 flex items-center gap-4">
      {/* Image */}
      <div className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
        {imageUrl
          ? <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
          : <span className="text-3xl">{emoji}</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{item.product.name}</h3>
        <p className="text-sm text-gray-400">{item.product.category_name}</p>
        <PriceTag price={item.product.final_price} size="sm" />
      </div>

      {/* Quantity */}
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="px-3 py-2 hover:bg-gray-100 text-gray-600 font-bold transition-colors">
          −
        </button>
        <span className="px-3 py-2 font-semibold text-gray-800 min-w-[36px] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="px-3 py-2 hover:bg-gray-100 text-gray-600 font-bold transition-colors">
          +
        </button>
      </div>

      {/* Subtotal + Remove */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-gray-800">৳{item.subtotal}</p>
        <button
          onClick={() => onRemove(item.id, item.product.name)}
          className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors">
          Remove
        </button>
      </div>
    </div>
  )
}

// ─── Order Summary ──────────────────────────────────────────
const OrderSummary = ({ total, total_items, delivery, grandTotal, onCheckout }) => (
  <div className="lg:col-span-1">
    <div className="card p-6 sticky top-24">
      <h3 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h3>

      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({total_items} items)</span>
          <span className="font-medium">৳{total}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery Charge</span>
          <span className={`font-medium ${delivery === 0 ? 'text-green-500' : ''}`}>
            {delivery === 0 ? 'FREE 🎉' : `৳${delivery}`}
          </span>
        </div>
        {delivery > 0 && (
          <p className="text-xs text-gray-400 bg-orange-50 px-3 py-2 rounded-lg">
            🎉 Add ৳{500 - Number(total)} more for free delivery!
          </p>
        )}
        <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span className="text-primary-500 text-lg">৳{grandTotal}</span>
        </div>
      </div>

      <button onClick={onCheckout} className="btn-primary w-full text-center py-3">
        Proceed to Checkout →
      </button>

      <Link to="/menu"
        className="block text-center text-sm text-primary-500 hover:text-primary-600 mt-4 font-medium">
        ← Continue Shopping
      </Link>
    </div>
  </div>
)

export default CartPage