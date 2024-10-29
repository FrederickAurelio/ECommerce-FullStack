import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cartItems: [],
  isLoading: false
}

export const addToCart = createAsyncThunk("cart/addToCart", async ({ userId, productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`http://localhost:5000/api/shop/cart/add`,
      { userId, productId, quantity },
      { withCredentials: true })
    return res?.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const getCartItems = createAsyncThunk("cart/getCartItems", async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`,
      { withCredentials: true })
    return res?.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async ({ userId, productId }, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`http://localhost:5000/api/shop/cart/delete/${userId}/${productId}`,
      { withCredentials: true })
    return res?.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const updateCartItemQty = createAsyncThunk(
  "cart/updateCartItemQty",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/shop/cart/update-cart`,
        { userId, productId, quantity },
        { withCredentials: true }
      );
      return res?.data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "An error occurred",
      });
    }
  }
);


const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartItemQty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(updateCartItemQty.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      })
  }
})

export default shoppingCartSlice.reducer;