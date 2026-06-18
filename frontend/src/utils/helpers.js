import { FOOD_EMOJIS, API_BASE, FREE_DELIVERY_THRESHOLD, DELIVERY_CHARGE } from './constants'

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${API_BASE}${imagePath}`
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