import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
}

export const registerUser = createAsyncThunk("/auth/register",
  async (formData) => {
    const response = await axios.post("http://localhost:5000/api/auth/register",
      formData, { withCredentials: true, })
    return response.data;
  })

export const loginUser = createAsyncThunk("/auth/login",
  async (formData) => {
    const response = await axios.post("http://localhost:5000/api/auth/login",
      formData, { withCredentials: true, })
    return response.data;
  })

export const logoutUser = createAsyncThunk("/auth/logout",
  async () => {
    const response = await axios.post("http://localhost:5000/api/auth/logout", {}, {
      withCredentials: true // Ensure cookies are included in the request
    });
    return response.data;
  })

export const checkAuth = createAsyncThunk("/auth/checkauth",
  async () => {
    const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
      withCredentials: true, headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      }
    })
    return response.data;
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
      .addCase(registerUser.pending, (state) => { state.isLoading = true })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => { state.isLoading = true })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => { state.isLoading = true })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => { state.isLoading = true })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;