import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { addToCart } from '../store/cartSlice'
import { useCartDrawer } from '../context/CartDrawerContext'

const useCart = () => {
  const dispatch = useDispatch()
  const { accessToken } = useSelector((state) => state.auth)
  const { total_items, total } = useSelector((state) => state.cart)
  const { openCart, toggleCart } = useCartDrawer()

  const handleAddToCart = async (productId, productName, quantity = 1) => {
    if (!accessToken) {
      toast.error('Please login to add to cart')
      return false
    }
    const result = await dispatch(addToCart({ product_id: productId, quantity }))
    if (addToCart.fulfilled.match(result)) {
      toast.success(`${productName} added to cart! 🛒`)
      openCart()
      return true
    }
    toast.error('Failed to add to cart')
    return false
  }

  return { handleAddToCart, total_items, total, openCart, toggleCart }
}

export default useCart