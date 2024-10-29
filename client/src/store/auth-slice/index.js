import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  init: true,
  searchedUser: null,
  searchLoading: false,
}

export const getUserById = createAsyncThunk("/auth/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/getUserById/${userId}`,
        { withCredentials: true, })
      return response.data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "An error occurred",
      });
    }
  })

export const registerUser = createAsyncThunk("/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register",
        formData, { withCredentials: true, })
      return response.data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "An error occurred",
      });
    }
  })

export const loginUser = createAsyncThunk("/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login",
        formData, { withCredentials: true, })
      return response.data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "An error occurred",
      });
    }
  })

export const logoutUser = createAsyncThunk("/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true // Ensure cookies are included in the request
      });
      return response.data; s
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "An error occurred",
      });
    }
  })

export const checkAuth = createAsyncThunk("/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
        withCredentials: true, headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        }
      })
      return response.data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "An error occurred",
      });
    }
  })


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.init = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.success;
        state.init = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.searchedUser = action.payload.user;
        state.searchLoading = false;
      })
      .addCase(getUserById.rejected, (state) => {
        state.searchLoading = false;
      })
      .addCase(getUserById.pending, (state) => {
        state.searchLoading = true;
      })
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;