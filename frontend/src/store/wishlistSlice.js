import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/wishlist/')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product_id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/wishlist/toggle/${product_id}/`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    products: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.products = action.payload.products || []
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.wishlisted) {
          // will refetch
        }
      })
  },
})

export default wishlistSlice.reducer