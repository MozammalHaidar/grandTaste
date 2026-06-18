import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { fetchWishlist } from '../store/wishlistSlice'
import { SkeletonCard } from '../components/ui/Skeleton'

const WishlistPage = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.wishlist)
  const { accessToken } = useSelector((state) => state.auth)

  useEffect(() => {
    if (accessToken) dispatch(fetchWishlist())
  }, [dispatch, accessToken])

  if (!accessToken) return (
    <Layout>
      <div className="container-custom py-20 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Please login to view your wishlist</h2>
        <Link to="/login" className="btn-primary px-8">Sign In</Link>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-10">
        <div className="container-custom text-white">
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <p className="text-orange-100 mt-1">{products.length} saved items</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8">Save your favorite items here!</p>
            <Link to="/menu" className="btn-primary px-10 py-3">Browse Menu 🍔</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default WishlistPage