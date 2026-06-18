import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProducts, getCategories, getFeaturedProducts } from '../api/productApi'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getProducts(params)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getCategories()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getFeaturedProducts()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    categories: [],
    totalCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.results || action.payload
        state.totalCount = action.payload.count || 0
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.results || action.payload || []
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload.results || action.payload || []
      })
  },
})

export default productSlice.reducer