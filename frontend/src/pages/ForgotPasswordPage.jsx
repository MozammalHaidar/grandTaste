import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import SEO from "../components/SEO";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/users/forgot-password/", { email });
      setSent(true);
      toast.success("Reset link sent!");
      // Development only — shows direct link
      if (data.reset_url) {
        setDevLink(data.reset_url);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4">
      <SEO
        title="Forgot Password"
        description="Reset your GrandTaste account password."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-4xl">🍔</span>
            <p className="text-xl font-bold text-primary-500 mt-1">
              GrandTaste
            </p>
          </Link>
        </div>

        {!sent ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔒
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Forgot Password?
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link 📧"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary-500 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email!
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              We sent a password reset link to <strong>{email}</strong>. Check
              your inbox and follow the instructions.
            </p>

            {/* Development helper */}
            {devLink && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-bold text-yellow-700 mb-2">
                  🛠 Development Mode — Direct Reset Link:
                </p>
                <Link
                  to={devLink.replace("http://localhost:5173", "")}
                  className="text-xs text-primary-500 hover:underline break-all font-mono"
                >
                  {devLink}
                </Link>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSent(false);
                  setDevLink(null);
                }}
                className="btn-outline w-full py-2.5 text-sm"
              >
                Try a different email
              </button>
              <Link
                to="/login"
                className="block text-center text-sm text-primary-500 hover:underline font-medium"
              >
                ← Back to Login
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
