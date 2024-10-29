import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  addressList: []
}

export const addNewAddress = createAsyncThunk("/address/addNewAddress", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post("http://localhost:5000/api/shop/address/add", formData, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const getAllAdresses = createAsyncThunk("/address/getAllAdresses", async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/shop/address/get/${userId}`,
      { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const editAddress = createAsyncThunk("/address/editAddress", async ({ userId, addressId, formData }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/shop/address/update/${userId}/${addressId}`, formData, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const deleteAddress = createAsyncThunk("/address/deleteAddress", async ({ userId, addressId }, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`, { withCredentials: true });

    return res.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllAdresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAdresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.address;
      })
      .addCase(getAllAdresses.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      })
  }
})

export default addressSlice.reducer;