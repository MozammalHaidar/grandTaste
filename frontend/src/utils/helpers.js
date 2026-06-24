import { FOOD_EMOJIS, API_BASE, FREE_DELIVERY_THRESHOLD, DELIVERY_CHARGE } from './constants'

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'
  return `${base}${imagePath}`
}

export const getFoodEmoji = (categoryName) => {
  return FOOD_EMOJIS[categoryName?.toLowerCase()] || FOOD_EMOJIS.default
}

export const getDeliveryCharge = (total) => {
  return Number(total) >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE
}

export const getGrandTotal = (total, discount = 0) => {
  return Number(total) - discount + getDeliveryCharge(total)
}

export const formatPrice = (price) => `৳${price}`

export const formatDate = (date) => new Date(date).toLocaleDateString('en-BD', {
  year: 'numeric', month: 'long', day: 'numeric'
})

export const generateSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')



const CL_OPT = 'f_auto,q_auto,w_400,h_400,c_pad,b_white';
const CL_BASE = `https://res.cloudinary.com/ddiouxm0f/image/upload/${CL_OPT}`;

export const getImageUrl = (url) => {
  if (!url) return '/placeholder.png';

  // Already a Cloudinary URL — inject optimization params if not already present
  if (url.includes('res.cloudinary.com')) {
    if (url.includes(CL_OPT)) return url; // already optimized, skip

    // If it has /image/upload/ already, inject params right after it
    if (url.includes('/image/upload/')) {
      return url.replace('/image/upload/', `/image/upload/${CL_OPT}/`);
    }

    // Missing /image/upload/ entirely — fix and add params
    return url.replace(
      /res\.cloudinary\.com\/([^/]+)\//,
      `res.cloudinary.com/$1/image/upload/${CL_OPT}/`
    );
  }

  // Render URL with /media/ — extract path and build optimized Cloudinary URL
  if (url.includes('onrender.com')) {
    const path = url.split('/media/')[1];
    if (path) return `${CL_BASE}/${path}`;
  }

  // Full external URL (not Cloudinary) — return as-is
  if (url.startsWith('http')) return url;

  // Local /media/ path
  if (url.startsWith('/media/')) {
    return `${CL_BASE}/${url.replace('/media/', '')}`;
  }

  // Just a filename like products/laptop.jpg
  return `${CL_BASE}/${url}`;
};