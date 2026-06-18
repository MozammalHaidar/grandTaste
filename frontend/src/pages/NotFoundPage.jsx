import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import SEO from '../components/SEO'



const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <SEO
        title="404 — Page Not Found"
        description="Oops! This page went out for delivery and never came back."
      />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg mx-auto">

          {/* Animated 404 */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative inline-block mb-6">
              {/* Big 404 text */}
              <h1 className="text-[120px] lg:text-[160px] font-bold text-primary-100 leading-none select-none">
                404
              </h1>
              {/* Food emoji floating in center */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 flex items-center justify-center text-6xl lg:text-7xl"
              >
                🍔
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Looks like this page went out for delivery and never came back! 
              Let's get you back to something delicious.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/" className="btn-primary px-8 py-3">
                🏠 Back to Home
              </Link>
              <Link to="/menu" className="btn-outline px-8 py-3">
                🍔 Browse Menu
              </Link>
            </div>

            {/* Go back link */}
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-400 hover:text-primary-500 transition-colors font-medium">
              ← Go back to previous page
            </button>
          </motion.div>

          {/* Floating food items */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { emoji: '🍕', top: '15%', left: '8%', delay: 0 },
              { emoji: '🍟', top: '20%', right: '8%', delay: 0.5 },
              { emoji: '🌮', bottom: '25%', left: '6%', delay: 1 },
              { emoji: '🥤', bottom: '20%', right: '6%', delay: 1.5 },
              { emoji: '🍗', top: '50%', left: '3%', delay: 0.8 },
              { emoji: '🍦', top: '45%', right: '3%', delay: 1.2 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ delay: item.delay, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: item.top,
                  bottom: item.bottom,
                  left: item.left,
                  right: item.right,
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: item.delay,
                  }}
                  className="text-3xl lg:text-4xl"
                >
                  {item.emoji}
                </motion.div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage