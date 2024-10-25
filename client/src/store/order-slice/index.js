import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
}

export const createNewOrder = createAsyncThunk("/order/createNewOrder", async (orderData) => {
  const res = await axios.post("http://localhost:5000/api/shop/order/create", orderData, { withCredentials: true });

  return res.data;
})

export const capturePayment = createAsyncThunk("/order/capturePayment", async ({ paymentId, payerId, orderId }) => {
  const res = await axios.post("http://localhost:5000/api/shop/order/capture", { paymentId, payerId, orderId }, { withCredentials: true });
  console.log(res)
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
  }
})

export default shoppingOrderSlice.reducer;