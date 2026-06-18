import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from './BackToTop'
import CartDrawer from './CartDrawer'
import QuickViewModal from './QuickViewModal'
import { useCartDrawer } from '../context/CartDrawerContext'
import { useQuickView } from '../context/QuickViewContext'

const Layout = ({ children }) => {
  const { isOpen, closeCart } = useCartDrawer()
  const { product, closeQuickView } = useQuickView()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
      {product && <QuickViewModal product={product} onClose={closeQuickView} />}
    </div>
  )
}

export default Layout

