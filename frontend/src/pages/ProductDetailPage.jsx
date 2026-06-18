import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { getProductDetail, createReview } from "../api/productApi";
import { getImageUrl } from "../utils/helpers";
import { useCartDrawer } from "../context/CartDrawerContext";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import SEO from "../components/SEO";
import { SkeletonProductDetail } from '../components/ui/Skeleton'

const StarRating = ({ rating, interactive = false, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        onClick={() => interactive && onRate && onRate(star)}
        className={`${interactive ? "w-7 h-7 cursor-pointer" : "w-4 h-4"}
          ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}
          ${interactive ? "hover:text-yellow-400" : ""} transition-colors`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ProductDetailPage = () => {
  const { openCart } = useCartDrawer();
  const { slug } = useParams();
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // ← add this
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProductDetail(slug);
        setProduct(data);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: product.id, quantity })).then((result) => {
      if (addToCart.fulfilled.match(result)) {
        toast.success(`${quantity}x ${product.name} added to cart!`);
        openCart();
      }
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await createReview(slug, reviewForm);
      toast.success("Review submitted!");
      const { data } = await getProductDetail(slug);
      setProduct(data);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

if (loading) return (
  <Layout>
    <SkeletonProductDetail />
  </Layout>
)

  if (!product)
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Product Not Found
          </h2>
          <Link to="/menu" className="btn-primary">
            Back to Menu
          </Link>
        </div>
      </Layout>
    );

  const imageUrl = getImageUrl(product.image);
  const foodEmojis = {
    burgers: "🍔",
    pizza: "🍕",
    chicken: "🍗",
    drinks: "🥤",
    fries: "🍟",
    tacos: "🌮",
  };
  const emoji = foodEmojis[product.category?.name?.toLowerCase()] || "🍽️";

  return (
    <Layout>
      <SEO
        title={product?.name}
        description={
          product?.description ||
          `Order ${product?.name} from GrandTaste. Fresh and delicious!`
        }
        image={product?.image ? getImageUrl(product.image) : undefined}
        type="product"
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-500">
              Home
            </Link>
            <span>/</span>
            <Link to="/menu" className="hover:text-primary-500">
              Menu
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl h-80 lg:h-96 flex items-center justify-center relative overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <span className="text-[140px] select-none">{emoji}</span>
            )}
            {product.is_featured && (
              <span className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ Featured
              </span>
            )}
            {product.discount_price && (
              <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Sale!
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-primary-500 font-medium mb-1">
              {product.category?.name}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.average_rating} />
              <span className="font-semibold text-gray-700">
                {product.average_rating}
              </span>
              <span className="text-gray-400 text-sm">
                ({product.review_count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary-500">
                ৳{product.final_price}
              </span>
              {product.discount_price && (
                <span className="text-xl text-gray-400 line-through">
                  ৳{product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description ||
                "Freshly prepared with the finest ingredients."}
            </p>

            {/* Meta info */}
            <div className="flex gap-4 mb-6">
              <div className="bg-orange-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Prep Time</p>
                <p className="font-bold text-gray-800">
                  ⏱ {product.preparation_time} min
                </p>
              </div>
              <div className="bg-orange-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Availability</p>
                <p
                  className={`font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {product.stock > 0
                    ? `✅ In Stock (${product.stock})`
                    : "❌ Sold Out"}
                </p>
              </div>
            </div>

            {/* Quantity + Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="px-5 py-3 font-semibold text-gray-800 min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-4 py-3 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 text-center"
                >
                  Add to Cart 🛒
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Customer Reviews ({product.review_count})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Review list */}
            <div className="lg:col-span-2 space-y-4">
              {product.reviews?.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="text-gray-500">No reviews yet. Be the first!</p>
                </div>
              ) : (
                product.reviews?.map((review) => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                          {review.user.first_name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {review.user.first_name} {review.user.last_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm leading-relaxed mt-2">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Write Review */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                {accessToken ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </label>
                      <StarRating
                        rating={reviewForm.rating}
                        interactive
                        onRate={(r) =>
                          setReviewForm({ ...reviewForm, rating: r })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Comment
                      </label>
                      <textarea
                        rows={4}
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                        }
                        className="input-field resize-none"
                        placeholder="Share your experience..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-primary w-full"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-4">
                      Sign in to leave a review
                    </p>
                    <Link to="/login" className="btn-primary py-2.5 px-6">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
