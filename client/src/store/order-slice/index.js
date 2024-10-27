import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
}

export const createNewOrder = createAsyncThunk("/order/createNewOrder", async (orderData) => {
  const res = await axios.post("http://localhost:5000/api/shop/order/create", orderData, { withCredentials: true });

  return res.data;
})

export const capturePayment = createAsyncThunk("/order/capturePayment", async ({ paymentId, payerId, orderId }) => {
  const res = await axios.post("http://localhost:5000/api/shop/order/capture", { paymentId, payerId, orderId }, { withCredentials: true });

  return res.data;
})

export const continuePayment = createAsyncThunk("/order/continuePayment", async (orderData) => {
  const res = await axios.post("http://localhost:5000/api/shop/order/continue", orderData, { withCredentials: true });

  return res.data;
})

export const getAllOrdersByUser = createAsyncThunk("/order/getAllOrdersByUser", async (userId) => {
  const res = await axios.get(`http://localhost:5000/api/shop/order/list/${userId}`, { withCredentials: true });

  return res.data;
})

export const getOrderDetails = createAsyncThunk("/order/getOrderDetails", async (id) => {
  const res = await axios.get(`http://localhost:5000/api/shop/order/details/${id}`, { withCredentials: true });

  return res.data;
})

const shoppingOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId))
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(continuePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(continuePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId))
      })
      .addCase(continuePayment.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(capturePayment.fulfilled, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(capturePayment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllOrdersByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.orders;
      })
      .addCase(getAllOrdersByUser.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
  }
})

export default shoppingOrderSlice.reducer;