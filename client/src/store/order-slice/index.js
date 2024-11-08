import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
}

export const createNewOrder = createAsyncThunk("/order/createNewOrder", async (orderData, { rejectWithValue }) => {
  try {
    const res = await axios.post("http://localhost:5000/api/shop/order/create", orderData, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const capturePayment = createAsyncThunk("/order/capturePayment", async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
  try {
    const res = await axios.post("http://localhost:5000/api/shop/order/capture", { paymentId, payerId, orderId }, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const continuePayment = createAsyncThunk("/order/continuePayment", async (orderData, { rejectWithValue }) => {
  try {
    const res = await axios.post("http://localhost:5000/api/shop/order/continue", orderData, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const getAllOrdersByUser = createAsyncThunk("/order/getAllOrdersByUser", async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/shop/order/list/${userId}`, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const getOrderDetails = createAsyncThunk("/order/getOrderDetails", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/shop/order/details/${id}`, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

const shoppingOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {
    resetShopOrderDetails: (state) => {
      state.orderDetails = null
    }
  },
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
      })
  }
})

export default shoppingOrderSlice.reducer;
export const { resetShopOrderDetails } = shoppingOrderSlice.actions;