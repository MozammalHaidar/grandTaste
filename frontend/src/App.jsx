import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderDetailPage from './pages/OrderDetailPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminCoupons from './pages/admin/AdminCoupons'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import PageTransition from './components/PageTransition'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import NotFoundPage from './pages/NotFoundPage'




function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
        <Route path="/product/:slug" element={<PageTransition><ProductDetailPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />

        {/* Protected */}
        <Route path="/cart" element={<PageTransition><PrivateRoute><CartPage /></PrivateRoute></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><PrivateRoute><WishlistPage /></PrivateRoute></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><PrivateRoute><CheckoutPage /></PrivateRoute></PageTransition>} />
        <Route path="/orders" element={<PageTransition><PrivateRoute><OrdersPage /></PrivateRoute></PageTransition>} />
        <Route path="/orders/:id" element={<PageTransition><PrivateRoute><OrderDetailPage /></PrivateRoute></PageTransition>} />
        <Route path="/profile" element={<PageTransition><PrivateRoute><ProfilePage /></PrivateRoute></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/reset-password/:uid/:token" element={<PageTransition><ResetPasswordPage /></PageTransition>} />

        {/* Admin */}
        <Route path="/admin" element={<PageTransition><AdminRoute><AdminDashboard /></AdminRoute></PageTransition>} />
        <Route path="/admin/orders" element={<PageTransition><AdminRoute><AdminOrders /></AdminRoute></PageTransition>} />
        <Route path="/admin/products" element={<PageTransition><AdminRoute><AdminProducts /></AdminRoute></PageTransition>} />
        <Route path="/admin/categories" element={<PageTransition><AdminRoute><AdminCategories /></AdminRoute></PageTransition>} />
        <Route path="/admin/customers" element={<PageTransition><AdminRoute><AdminCustomers /></AdminRoute></PageTransition>} />
        <Route path="/admin/coupons" element={<PageTransition><AdminRoute><AdminCoupons /></AdminRoute></PageTransition>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App