import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { toggleWishlist, fetchWishlist } from '../store/wishlistSlice'

const useWishlist = () => {
  const dispatch = useDispatch()
  const { accessToken } = useSelector((state) => state.auth)
  const { products } = useSelector((state) => state.wishlist)

  const isWished = (productId) => products?.some((p) => p.id === productId)

  const handleToggleWishlist = async (productId) => {
    if (!accessToken) {
      toast.error('Please login to use wishlist')
      return
    }
    const result = await dispatch(toggleWishlist(productId))
    if (toggleWishlist.fulfilled.match(result)) {
      dispatch(fetchWishlist())
      toast.success(result.payload.wishlisted ? 'Added to wishlist ❤️' : 'Removed from wishlist')
    }
  }

  return { isWished, handleToggleWishlist, wishlistProducts: products }
}

export default useWishlist