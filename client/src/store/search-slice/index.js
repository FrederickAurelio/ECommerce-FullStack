import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  searchResult: []
}

export const getSearchResults = createAsyncThunk("/search/getSearchResults", async (keyword, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/shop/search/${keyword}`, { withCredentials: true })
    return response?.data;
  } catch (error) {
    return rejectWithValue({
      success: false,
      message: error.response?.data?.message || "An error occurred",
    });
  }
})

const searchSlice = createSlice({
  name: "searchSlce",
  initialState,
  reducers: {
    resetSearchResult: (state) => {
      state.searchResult = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResult = action.payload.searchResult;
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
      })
  }
})


export const { resetSearchResult } = searchSlice.actions;
export default searchSlice.reducer;