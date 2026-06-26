import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { fetchFeaturedProducts, fetchCategories } from "../store/productSlice";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/helpers";
import SEO from "../components/SEO";
import { SkeletonFeatured, SkeletonCategories } from '../components/ui/Skeleton'

const FadeInSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const CategoryCard = ({ cat }) => (
  <Link
    to={`/menu?category=${cat.slug}`}
    className="bg-orange-50 rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-200 cursor-pointer group"
  >
    {cat.image ? (
      <div className="w-14 h-14 mx-auto mb-2 rounded-xl overflow-hidden">
        <img
          src={getImageUrl(cat.image)}
          alt={cat.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    ) : (
      <div className="text-4xl mb-2">🍽️</div>
    )}
    <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
    <p className="text-xs text-gray-400 mt-0.5">{cat.product_count} items</p>
  </Link>
)

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const testimonials = [
  {
    name: "Rahim Uddin",
    text: "Best burgers in town! Always fresh and delivered on time.",
    rating: 5,
    avatar: "R",
  },
  {
    name: "Priya Das",
    text: "Love the variety! The chicken pizza is absolutely amazing.",
    rating: 5,
    avatar: "P",
  },
  {
    name: "Karim Sheikh",
    text: "Super fast delivery and the food is always hot. 10/10!",
    rating: 5,
    avatar: "K",
  },
];

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    featured = [],
    categories: apiCategories = [],
    loading,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Layout>
      <SEO
        title="Home"
        description="Order hot & fresh burgers, pizza, chicken and more. Delivered to your door in 30 minutes!"
      />

      {/* ===================== HERO SECTION ===================== */}
      <FadeInSection>
        <section className="bg-gradient-to-br from-primary-50 via-white to-orange-50 overflow-hidden">
          <div className="container-custom py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — Content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  Free delivery on orders over ৳500
                </div>

                {/* H1 — Main headline */}
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                  Hot & Fresh Food{" "}
                  <span className="text-gradient">Delivered Fast</span>
                </h1>

                {/* H2 — Subheadline */}
                <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                  Order your favorite burgers, pizza, and more. Fresh
                  ingredients, bold flavors, delivered to your door in 30
                  minutes or less.
                </p>

                {/* CTA Buttons — Above the fold */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    to="/menu"
                    className="btn-primary text-center text-lg px-8 py-4"
                  >
                    Order Now 🍔
                  </Link>
                  <Link
                    to="/menu"
                    className="btn-outline text-center text-lg px-8 py-4"
                  >
                    Browse Menu
                  </Link>
                </div>

                {/* Social Proof — Above the fold */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex -space-x-3">
                    {["A", "B", "C", "D"].map((l, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={5} />
                      <span className="font-bold text-gray-800 ml-1">4.9</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      500+ happy customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — Visual */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-80 h-80 lg:w-[480px] lg:h-[480px]">
                  {/* Glow ring */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20 blur-3xl" />

                  {/* Circular background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-orange-100 rounded-full border-[10px] border-primary-200" />

                  {/* Your food image */}
                  <div className="absolute inset-2 rounded-full overflow-hidden border-[10px] border-primary-200">
                    <img
                      src="/images/hero.jpg"
                      alt="Delicious Fast Food"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Floating badge — top right */}
                  <div className="absolute top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2 z-10">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Delivery</p>
                      <p className="text-sm font-bold text-gray-800">30 min</p>
                    </div>
                  </div>

                  {/* Floating badge — bottom left */}
                  <div className="absolute bottom-8 -left-4 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2 z-10">
                    <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg">⭐</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Rating</p>
                      <p className="text-sm font-bold text-gray-800">
                        4.9 / 5.0
                      </p>
                    </div>
                  </div>

                  {/* Floating badge — bottom right */}
                  <div className="absolute bottom-0 -right-2 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2 z-10">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg">🍔</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Menu Items</p>
                      <p className="text-sm font-bold text-gray-800">
                        50+ Items
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== STATS BAR ===================== */}
        <section className="bg-primary-500">
          <div className="container-custom py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
              {[
                { value: "500+", label: "Happy Customers" },
                { value: "50+", label: "Menu Items" },
                { value: "30 min", label: "Avg Delivery" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
                  <p className="text-orange-100 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CATEGORIES ===================== */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            {/* Section Header */}
            <div className="text-center mb-10">
              <p className="text-primary-500 font-medium mb-2">
                What are you craving?
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Browse Categories
              </h2>
            </div>

            {/* Grid */}
           {apiCategories.length === 0 ? (
              <SkeletonCategories />
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {apiCategories.map((cat) => (
                  <CategoryCard key={cat.id} cat={cat} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===================== FEATURED ITEMS ===================== */}
        <section className="py-16 bg-primary-50">
          <div className="container-custom">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-primary-500 font-medium mb-1">
                  Hand-picked for you
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                  Popular Items
                </h2>
              </div>
              <Link
                to="/menu"
                className="btn-outline py-2 px-5 text-sm hidden md:block"
              >
                View All →
              </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading
                ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                : featured.slice(0, 12).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>

            {/* Mobile View All */}
            <div className="text-center mt-8 md:hidden">
              <Link to="/menu" className="btn-outline py-2.5 px-8">
                View All Items →
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== HOW IT WORKS ===================== */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-primary-500 font-medium mb-2">Simple & Easy</p>
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-primary-100" />
              {[
                {
                  step: "01",
                  icon: "🍔",
                  title: "Choose Your Food",
                  desc: "Browse our menu and pick your favorites from 50+ delicious items.",
                },
                {
                  step: "02",
                  icon: "💳",
                  title: "Place Your Order",
                  desc: "Add to cart, apply coupons, and checkout securely in seconds.",
                },
                {
                  step: "03",
                  icon: "🚀",
                  title: "Fast Delivery",
                  desc: "Track your order in real-time and get it delivered hot to your door.",
                },
              ].map((step) => (
                <div key={step.step} className="text-center relative">
                  <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 relative">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {step.step.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== TESTIMONIALS ===================== */}
        <section className="py-16 bg-gray-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-primary-400 font-medium mb-2">Social Proof</p>
              <h2 className="text-3xl font-bold text-white">
                What Our Customers Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-gray-800 rounded-2xl p-6">
                  <StarRating rating={t.rating} />
                  <p className="text-gray-300 mt-4 mb-6 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">Verified Customer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CTA BANNER ===================== */}
        <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700">
          <div className="container-custom text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Ready to Order? 🍔
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
              Join 500+ happy customers. Get your first order delivered free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/menu"
                className="bg-white text-primary-600 hover:bg-orange-50 font-bold py-4 px-10 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl"
              >
                Order Now 🍔
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-xl transition-all text-lg"
                >
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </section>
      </FadeInSection>
    </Layout>
  );
};

export default HomePage;
