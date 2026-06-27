import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios";
import { setCredentials } from "../store/authSlice";
import SEO from "../components/SEO";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/users/register/", formData);
      dispatch(
        setCredentials({
          user: data.user,
          access: data.access,
          refresh: data.refresh,
        }),
      );
      toast.success("Account created! Welcome to GrandTaste 🎉");
      navigate("/");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        Object.values(errors).forEach((msg) =>
          toast.error(Array.isArray(msg) ? msg[0] : msg),
        );
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-primary-50 flex">
    //   <SEO
    //     title="Create Account"
    //     description="Join GrandTaste and get your first order delivered free!"
    //   />
    //   {/* Left Side — Branding */}
    //   <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 flex-col justify-center items-center p-12 relative overflow-hidden">
    //     <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white opacity-5 rounded-full" />
    //     <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-white opacity-5 rounded-full" />
    //     <div className="relative z-10 text-center text-white">
    //       <div className="text-8xl mb-6">🍔</div>
    //       <h1 className="text-5xl font-bold mb-4 text-white">GrandTaste</h1>
    //       <p className="text-xl text-orange-100 mb-8 max-w-sm leading-relaxed">
    //         Join thousands of happy customers enjoying hot, fresh food every
    //         day.
    //       </p>
    //       {/* Benefits */}
    //       <div className="space-y-4 text-left mt-8">
    //         {[
    //           { icon: "⚡", text: "Fast delivery in 30 minutes" },
    //           { icon: "🍕", text: "50+ delicious menu items" },
    //           { icon: "💳", text: "Secure & easy payments" },
    //           { icon: "⭐", text: "Track your order in real-time" },
    //         ].map((item) => (
    //           <div key={item.text} className="flex items-center gap-3">
    //             <span className="text-2xl">{item.icon}</span>
    //             <span className="text-orange-100">{item.text}</span>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Right Side — Form */}
    //   <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
    //     <div className="w-full max-w-md">
    //       {/* Mobile logo */}
    //       <div className="text-center mb-8 lg:hidden">
    //         <span className="text-5xl">🍔</span>
    //         <h1 className="text-2xl font-bold text-primary-500 mt-2">
    //           GrandTaste
    //         </h1>
    //       </div>

    //       <div className="mb-8">
    //         <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
    //         <p className="text-gray-500 mt-2">
    //           Start ordering your favorite food today
    //         </p>
    //       </div>

    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         {/* Name row */}
    //         <div className="grid grid-cols-2 gap-4">
    //           <div>
    //             <label className="block text-sm font-medium text-gray-700 mb-2">
    //               First Name
    //             </label>
    //             <input
    //               type="text"
    //               name="first_name"
    //               required
    //               value={formData.first_name}
    //               onChange={handleChange}
    //               className="input-field"
    //               placeholder="John"
    //             />
    //           </div>
    //           <div>
    //             <label className="block text-sm font-medium text-gray-700 mb-2">
    //               Last Name
    //             </label>
    //             <input
    //               type="text"
    //               name="last_name"
    //               required
    //               value={formData.last_name}
    //               onChange={handleChange}
    //               className="input-field"
    //               placeholder="Doe"
    //             />
    //           </div>
    //         </div>

    //         {/* Email */}
    //         <div>
    //           <label className="block text-sm font-medium text-gray-700 mb-2">
    //             Email Address
    //           </label>
    //           <input
    //             type="email"
    //             name="email"
    //             required
    //             value={formData.email}
    //             onChange={handleChange}
    //             className="input-field"
    //             placeholder="you@example.com"
    //           />
    //         </div>

    //         {/* Password */}
    //         <div>
    //           <label className="block text-sm font-medium text-gray-700 mb-2">
    //             Password
    //           </label>
    //           <div className="relative">
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               name="password"
    //               required
    //               value={formData.password}
    //               onChange={handleChange}
    //               className="input-field pr-12"
    //               placeholder="Min 8 characters"
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowPassword(!showPassword)}
    //               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
    //             >
    //               {showPassword ? "Hide" : "Show"}
    //             </button>
    //           </div>
    //         </div>

    //         {/* Confirm Password */}
    //         <div>
    //           <label className="block text-sm font-medium text-gray-700 mb-2">
    //             Confirm Password
    //           </label>
    //           <input
    //             type="password"
    //             name="password2"
    //             required
    //             value={formData.password2}
    //             onChange={handleChange}
    //             className="input-field"
    //             placeholder="••••••••"
    //           />
    //         </div>

    //         {/* Password strength hint */}
    //         <p className="text-xs text-gray-400">
    //           Password must be at least 8 characters with letters and numbers.
    //         </p>

    //         {/* CTA */}
    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="btn-primary w-full text-center mt-2"
    //         >
    //           {loading ? (
    //             <span className="flex items-center justify-center gap-2">
    //               <svg
    //                 className="animate-spin h-5 w-5"
    //                 viewBox="0 0 24 24"
    //                 fill="none"
    //               >
    //                 <circle
    //                   className="opacity-25"
    //                   cx="12"
    //                   cy="12"
    //                   r="10"
    //                   stroke="currentColor"
    //                   strokeWidth="4"
    //                 />
    //                 <path
    //                   className="opacity-75"
    //                   fill="currentColor"
    //                   d="M4 12a8 8 0 018-8v8z"
    //                 />
    //               </svg>
    //               Creating account...
    //             </span>
    //           ) : (
    //             "Create Account →"
    //           )}
    //         </button>
    //       </form>

    //       <p className="text-center text-sm text-gray-500 mt-6">
    //         Already have an account?{" "}
    //         <Link
    //           to="/login"
    //           className="text-primary-500 font-semibold hover:text-primary-600 hover:underline"
    //         >
    //           Sign in →
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-6 relative overflow-hidden">
    <SEO
      title="Create Account"
      description="Join GrandTaste and get your first order delivered free!"
    />

    {/* Decorative Shapes */}
    {/* <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-bl-full" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-tr-full" /> */}

    {/* Register Card */}
    <div className="relative z-10 w-full max-w-[560px]">

        {/* Top Right Shape */}
    <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-bl-full" />

    {/* Bottom Left Shape */}
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-tr-full" />
      <div className="bg-white rounded-3xl shadow-lg border border-primary-100 p-6 md:p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-4xl">🍔</span>
          <h1 className="text-2xl font-bold text-primary-500 mt-1">
            GrandTaste
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2">
            Start ordering your favorite food today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field pr-12"
                placeholder="Minimum 8 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="password2"
              required
              value={formData.password2}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
            />
          </div>

          {/* Password Hint */}
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-3">
            <p className="text-xs text-gray-600">
              Password should contain at least 8 characters, including letters
              and numbers.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
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
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-500 font-semibold hover:text-primary-600 hover:underline"
          >
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
};

export default RegisterPage;
