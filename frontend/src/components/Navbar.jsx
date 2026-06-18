import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../store/cartSlice";
import { searchProducts } from "../api/productApi";
import { getImageUrl, getFoodEmoji } from "../utils/helpers";
import { useCartDrawer } from "../context/CartDrawerContext";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken, handleLogout, isAdmin } = useAuth()
  const { total_items } = useSelector((state) => state.cart);
  const { toggleCart } = useCartDrawer();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (accessToken) dispatch(fetchCart());
  }, [accessToken, dispatch]);

  // Combined outside click handler for both search and profile
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSuggestions([]);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Live search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await searchProducts(searchQuery);
        setSuggestions(data.results || data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    setSuggestions([]);
    setSearchQuery("");
    navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSuggestionClick = (slug) => {
    setSearchOpen(false);
    setSuggestions([]);
    setSearchQuery("");
    navigate(`/product/${slug}`);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-3xl">🍔</span>
              <span className="text-xl font-bold text-primary-500">
                GrandTaste
              </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Home</Link>
            <Link to="/menu" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Menu</Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">Contact</Link>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-sm hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search food..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button type="button"
                    onClick={() => { setSearchQuery(""); setSuggestions([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {searchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {searchLoading ? (
                  <div className="px-4 py-6 text-center">
                    <div className="animate-spin text-2xl mb-2">⏳</div>
                    <p className="text-sm text-gray-400">Searching...</p>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-2xl mb-2">🔍</p>
                    <p className="text-sm text-gray-400">No results for "{searchQuery}"</p>
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">{suggestions.length} results found</p>
                    </div>
                    {suggestions.map((product) => (
                      <button key={product.id}
                        onClick={() => handleSuggestionClick(product.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-left border-b border-gray-50 last:border-0">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {getImageUrl(product.image)
                            ? <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                            : <span className="text-xl">{getFoodEmoji(product.category_name)}</span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category_name}</p>
                        </div>
                        <p className="text-sm font-bold text-primary-500 flex-shrink-0">৳{product.final_price}</p>
                      </button>
                    ))}
                    <button onClick={handleSearchSubmit}
                      className="w-full px-4 py-3 text-sm text-primary-500 font-medium hover:bg-primary-50 transition-colors text-center border-t border-gray-100">
                      View all results for "{searchQuery}" →
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {accessToken ? (
              <>
                {/* Cart */}
                <button onClick={toggleCart}
                  className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                  {total_items > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {total_items}
                    </span>
                  )}
                </button>

                {/* Wishlist */}
                <Link to="/wishlist" className="p-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary-50 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.avatar
                        ? <img src={getImageUrl(user.avatar)} alt="avatar" className="w-full h-full object-cover" />
                        : user?.first_name?.[0]?.toUpperCase() || "U"
                      }
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.first_name}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      {[
                        { to: "/profile", label: "👤 My Profile" },
                        { to: "/orders", label: "📦 My Orders" },
                        { to: "/wishlist", label: "❤️ Wishlist" },
                      ].map((item) => (
                        <Link key={item.to} to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                          {item.label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-outline py-2 px-5 text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started →</Link>
              </div>
            )}
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-primary-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {accessToken && (
              <button onClick={toggleCart} className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                {total_items > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {total_items}
                  </span>
                )}
              </button>
            )}

            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div ref={searchRef} className="md:hidden pb-3 px-1">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food..." autoFocus
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            {searchQuery.trim() && suggestions.length > 0 && (
              <div className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {suggestions.map((product) => (
                  <button key={product.id}
                    onClick={() => handleSuggestionClick(product.slug)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-left border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {getImageUrl(product.image)
                        ? <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                        : <span className="text-lg">{getFoodEmoji(product.category_name)}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category_name}</p>
                    </div>
                    <p className="text-sm font-bold text-primary-500">৳{product.final_price}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {[
              { to: "/", label: "Home" },
              { to: "/menu", label: "Menu" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link key={item.to} to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-colors font-medium">
                {item.label}
              </Link>
            ))}
            {accessToken ? (
              <>
                {[
                  { to: "/profile", label: "👤 My Profile" },
                  { to: "/orders", label: "📦 My Orders" },
                  { to: "/wishlist", label: "❤️ Wishlist" },
                ].map((item) => (
                  <Link key={item.to} to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-colors font-medium">
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-colors font-medium">
                    ⚙️ Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                  🚪 Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-center py-2">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center py-2">Get Started →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;