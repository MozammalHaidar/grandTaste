import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios";
import { setCredentials } from "../store/authSlice";
import SEO from "../components/SEO";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/users/login/", formData);
      const profile = await api.get("/users/profile/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      dispatch(
        setCredentials({
          user: profile.data,
          access: data.access,
          refresh: data.refresh,
        }),
      );
      // Remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      toast.success(`Welcome back, ${profile.data.first_name}! 👋`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-primary-50 flex">
      <SEO
        title="Sign In"
        description="Sign in to your GrandTaste account and start ordering!"
      />
      {/* Left Side — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background circles — decorative */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white opacity-5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-white opacity-5 rounded-full" />

        <div className="relative z-10 text-center text-white">
          <div className="text-8xl mb-6">🍔</div>
          <h1 className="text-5xl font-bold mb-4 text-white">GrandTaste</h1>
          <p className="text-xl text-orange-100 mb-8 max-w-sm leading-relaxed">
            Hot & fresh food delivered to your doorstep in minutes.
          </p>
          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-orange-200 text-sm">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-orange-300 opacity-50" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-orange-200 text-sm">Menu Items</p>
            </div>
            <div className="w-px h-12 bg-orange-300 opacity-50" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">4.9★</p>
              <p className="text-orange-200 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <span className="text-5xl">🍔</span>
            <h1 className="text-2xl font-bold text-primary-500 mt-2">
              GrandTaste
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-500 mt-2">Sign in to continue ordering</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
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

            {/* ✅ Remember Me + Forgot Password — add here */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      rememberMe
                        ? "bg-primary-500 border-primary-500"
                        : "border-gray-300 group-hover:border-primary-400"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center mt-2"
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
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-500 font-semibold hover:text-primary-600 hover:underline"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  //    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4 relative overflow-hidden">
  //   <SEO
  //     title="Sign In"
  //     description="Sign in to your GrandTaste account and start ordering!"
  //   />

  //   {/* Top Right Shape */}
  //   {/* <div className="absolute top-0 right-0 w-72 h-72 bg-primary-400/10 rounded-bl-full" /> */}

  //   {/* Bottom Left Shape */}
  //   {/* <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-tr-full" /> */}

  //   {/* Login Card */}
  //   <div className="relative z-10 w-full max-w-[448px]">
  //       {/* Top Right Shape */}
  //   <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-bl-full" />

  //   {/* Bottom Left Shape */}
  //   <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-tr-full" />
  //     <div className="bg-white rounded-3xl shadow-xl border border-primary-100 p-8 md:p-10">
  //       {/* Logo */}
  //       <div className="text-center mb-8">
  //         <span className="text-5xl">🍔</span>
  //         <h1 className="text-2xl font-bold text-primary-500 mt-2">
  //           GrandTaste
  //         </h1>
  //       </div>

  //       {/* Heading */}
  //       <div className="mb-8 text-center">
  //         <h2 className="text-3xl font-bold text-gray-900">
  //           Welcome Back
  //         </h2>
  //         <p className="text-gray-500 mt-2">
  //           Sign in to continue ordering your favorite meals
  //         </p>
  //       </div>

  //       <form onSubmit={handleSubmit} className="space-y-5">
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
  //               placeholder="••••••••"
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

  //         {/* Remember Me + Forgot Password */}
  //         <div className="flex items-center justify-between">
  //           <label className="flex items-center gap-2 cursor-pointer group">
  //             <div className="relative">
  //               <input
  //                 type="checkbox"
  //                 checked={rememberMe}
  //                 onChange={(e) => setRememberMe(e.target.checked)}
  //                 className="sr-only"
  //               />

  //               <div
  //                 className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
  //                   rememberMe
  //                     ? "bg-primary-500 border-primary-500"
  //                     : "border-gray-300 group-hover:border-primary-400"
  //                 }`}
  //               >
  //                 {rememberMe && (
  //                   <svg
  //                     className="w-3 h-3 text-white"
  //                     fill="none"
  //                     stroke="currentColor"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <path
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                       strokeWidth={3}
  //                       d="M5 13l4 4L19 7"
  //                     />
  //                   </svg>
  //                 )}
  //               </div>
  //             </div>

  //             <span className="text-sm text-gray-600">
  //               Remember me
  //             </span>
  //           </label>

  //           <Link
  //             to="/forgot-password"
  //             className="text-sm text-primary-500 hover:text-primary-600 font-medium hover:underline"
  //           >
  //             Forgot password?
  //           </Link>
  //         </div>

  //         {/* Login Button */}
  //         <button
  //           type="submit"
  //           disabled={loading}
  //           className="btn-primary w-full text-center"
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
  //               Signing in...
  //             </span>
  //           ) : (
  //             "Sign In"
  //           )}
  //         </button>
  //       </form>

  //       {/* Divider */}
  //       <div className="flex items-center my-6">
  //         <div className="flex-1 h-px bg-gray-200" />
  //         <span className="px-4 text-sm text-gray-400">or</span>
  //         <div className="flex-1 h-px bg-gray-200" />
  //       </div>

  //       {/* Register Link */}
  //       <p className="text-center text-sm text-gray-500">
  //         Don't have an account?{" "}
  //         <Link
  //           to="/register"
  //           className="text-primary-500 font-semibold hover:text-primary-600 hover:underline"
  //         >
  //           Create one free →
  //         </Link>
  //       </p>
  //     </div>
  //   </div>
  // </div>

  );
};
export default LoginPage;
