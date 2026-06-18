import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart/')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const addToCart = createAsyncThunk('cart/add', async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart/items/', { product_id, quantity })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const updateCartItem = createAsyncThunk('cart/update', async ({ item_id, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/cart/items/${item_id}/`, { quantity })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const removeCartItem = createAsyncThunk('cart/remove', async (item_id, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/items/${item_id}/`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/')
    return { items: [], total: 0, total_items: 0 }
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    total_items: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false
      state.items = action.payload.items || []
      state.total = action.payload.total || 0
      state.total_items = action.payload.total_items || 0
    }
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeCartItem.fulfilled, setCart)
      .addCase(clearCart.fulfilled, setCart)
  },
})

export default cartSlice.reducer