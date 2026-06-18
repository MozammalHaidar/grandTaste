// Food category emojis
export const FOOD_EMOJIS = {
  burgers: '🍔',
  pizza: '🍕',
  chicken: '🍗',
  drinks: '🥤',
  fries: '🍟',
  tacos: '🌮',
  default: '🍽️',
}

// Order status colors
export const STATUS_COLORS = {
  pending:          'bg-yellow-100 text-yellow-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
}

// Order status info
export const STATUS_INFO = {
  pending:          { label: 'Order Placed',    icon: '📋', color: 'text-yellow-500', bg: 'bg-yellow-50',  border: 'border-yellow-200',  desc: 'Your order has been received' },
  confirmed:        { label: 'Confirmed',        icon: '✅', color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-200',    desc: 'Restaurant confirmed your order' },
  preparing:        { label: 'Preparing',        icon: '👨‍🍳', color: 'text-orange-500', bg: 'bg-orange-50',  border: 'border-orange-200',  desc: 'Chef is preparing your food' },
  out_for_delivery: { label: 'Out for Delivery', icon: '🚴', color: 'text-purple-500', bg: 'bg-purple-50',  border: 'border-purple-200',  desc: 'Rider is on the way to you' },
  delivered:        { label: 'Delivered',        icon: '🎉', color: 'text-green-500',  bg: 'bg-green-50',   border: 'border-green-200',   desc: 'Enjoy your meal!' },
  cancelled:        { label: 'Cancelled',        icon: '❌', color: 'text-red-500',    bg: 'bg-red-50',     border: 'border-red-200',     desc: 'Order was cancelled' },
}

// Order status steps
export const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

// Delivery charge config
export const FREE_DELIVERY_THRESHOLD = 500
export const DELIVERY_CHARGE = 60

// API base
export const API_BASE = 'http://127.0.0.1:8000'