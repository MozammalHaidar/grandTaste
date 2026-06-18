import api from './axios'

export const getCategories = () => api.get('/products/categories/')
export const getProducts = (params) => api.get('/products/', { params })
export const getFeaturedProducts = () => api.get('/products/featured/')
export const getProductDetail = (slug) => api.get(`/products/${slug}/`)
export const getProductReviews = (slug) => api.get(`/products/${slug}/reviews/`)
export const createReview = (slug, data) => api.post(`/products/${slug}/reviews/create/`, data)
export const searchProducts = (query) =>
  api.get('/products/', { params: { search: query, page_size: 5 } })