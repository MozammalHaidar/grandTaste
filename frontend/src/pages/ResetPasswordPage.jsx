import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import SEO from "../components/SEO";

const ResetPasswordPage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    new_password: "",
    new_password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.new_password2) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/users/reset-password/", {
        uid,
        token,
        new_password: formData.new_password,
        new_password2: formData.new_password2,
      });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4">
      <SEO
        title="Reset Password"
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

        {!success ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔑
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reset Password
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new_password"
                    required
                    value={formData.new_password}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="new_password2"
                  required
                  value={formData.new_password2}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              {/* Password strength */}
              {formData.new_password && (
                <div className="space-y-1">
                  {[
                    {
                      label: "At least 8 characters",
                      check: formData.new_password.length >= 8,
                    },
                    {
                      label: "Contains a number",
                      check: /\d/.test(formData.new_password),
                    },
                    {
                      label: "Contains a letter",
                      check: /[a-zA-Z]/.test(formData.new_password),
                    },
                  ].map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2">
                      <span
                        className={`text-xs ${rule.check ? "text-green-500" : "text-gray-300"}`}
                      >
                        {rule.check ? "✅" : "○"}
                      </span>
                      <span
                        className={`text-xs ${rule.check ? "text-green-600" : "text-gray-400"}`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password 🔑"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link
                to="/login"
                className="text-primary-500 font-semibold hover:underline"
              >
                ← Back to Login
              </Link>
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset!
            </h2>
            <p className="text-gray-500 mb-2 text-sm">
              Your password has been reset successfully.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Redirecting to login in 3 seconds...
            </p>
            <Link to="/login" className="btn-primary px-8 py-2.5 inline-block">
              Go to Login →
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
