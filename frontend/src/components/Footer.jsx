import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍔</span>
              <span className="text-xl font-bold text-primary-500">
                GrandTaste
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hot & fresh food delivered to your doorstep. Order now and enjoy
              the best burgers in town.
            </p>
            <div className="flex gap-3 mt-4">
              {["📘", "🐦", "📸", "▶️"].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors text-sm"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Menu", to: "/menu" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">
              My Account
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Profile", to: "/profile" },
                { label: "My Orders", to: "/orders" },
                { label: "Wishlist", to: "/wishlist" },
                { label: "Cart", to: "/cart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span>📍</span> 123 Food Street, Dhaka, Bangladesh
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span>📞</span> +880 1700-000000
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span>📧</span> hello@GrandTaste.com
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span>🕐</span> Open: 10AM – 11PM Daily
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 GrandTaste. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
