import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  productList: []
}

export const createNewProduct = createAsyncThunk("/adminProducts/createproduct", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    return response?.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const getAllProducts = createAsyncThunk("/adminProducts/getAllProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:5000/api/admin/products/get");
    return response.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const editProduct = createAsyncThunk("/adminProducts/editProduct", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/admin/products/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    return response?.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

export const deleteProduct = createAsyncThunk("/adminProducts/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/admin/products/delete/${id}`, {
      withCredentials: true,
    })
    return response?.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.products;
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createNewProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createNewProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      })
  }
})

export default AdminProductsSlice.reducer;