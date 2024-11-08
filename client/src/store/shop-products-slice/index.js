import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
}

export const getFilteredProducts = createAsyncThunk("/adminProducts/getFilteredProducts", async ({ filter, sortBy }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/shop/products/get?filter=${filter}&sortBy=${sortBy}`);
    return response.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const getDetailedProducts = createAsyncThunk("/adminProducts/getDetailedProducts", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const createReview = createAsyncThunk("/adminProducts/createReview", async ({ productId, comment, rating }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/shop/review/create/${productId}`, { comment, rating }, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

const ShopProductsSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.products;
      })
      .addCase(getFilteredProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getDetailedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDetailedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.product;
      })
      .addCase(getDetailedProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createReview.rejected, (state) => {
        state.isLoading = false;
      })
  }
})

export default ShopProductsSlice.reducer;

export const { setProductDetails } = ShopProductsSlice.actions;