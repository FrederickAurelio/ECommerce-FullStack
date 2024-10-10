import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
}

export const getFilteredProducts = createAsyncThunk("/adminProducts/getFilteredProducts", async ({ filter, sortBy }) => {
  const response = await axios.get(`http://localhost:5000/api/shop/products/get?filter=${filter}&sortBy=${sortBy}`);
  return response.data;
})

export const getDetailedProducts = createAsyncThunk("/adminProducts/getDetailedProducts", async (id) => {
  const response = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`);
  return response.data;
})

const ShopProductsSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {},
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
        state.productList = [];
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
        state.productDetails = null;
      })
  }
})

export default ShopProductsSlice.reducer;