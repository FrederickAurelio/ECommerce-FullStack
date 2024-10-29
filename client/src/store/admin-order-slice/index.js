import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};


export const getAllOrdersForAdmin = createAsyncThunk("/order/getAllOrdersForAdmin", async () => {
  const res = await axios.get(`http://localhost:5000/api/admin/order/get`, { withCredentials: true });

  return res.data;
})

export const getOrderDetailsForAdmin = createAsyncThunk("/order/getOrderDetailsForAdmin", async (id) => {
  const res = await axios.get(`http://localhost:5000/api/admin/order/details/${id}`, { withCredentials: true });

  return res.data;
})

export const updateOrderStatus = createAsyncThunk("/order/updateOrderStatus", async ({ id, orderStatus }) => {
  const res = await axios.put(`http://localhost:5000/api/admin/order/update/${id}`, { orderStatus }, { withCredentials: true });

  return res.data;
})

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.orders;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.order;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.order;
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })
  }
})

export default adminOrderSlice.reducer;