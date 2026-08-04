import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";


export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async(productId, {rejectWithValue})=>{
    try {
      const res = await api.patch(`/user/like/${productId}`)
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);
export const getLikeList = createAsyncThunk(
  "like/getLikeList",
  async (_, { rejectWithValue }) =>{
    try {
      const res = await api.get('/user/like');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);
const likeSlice = createSlice({
    name: "like",    
    initialState: {
        likeList: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
      clearLike: (state) => {
        state.likeList = [];
        state.error = null;
        state.success = null;
      },
      clearSuccess: (state) => {
        state.success = false;
      },
      clearErrors: (state) => {
        state.error = null;
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state,action)=>{
        state.loading = true;
        state.error = "";
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        state.likeList = action.payload.likeList;
        state.success = true; 
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getLikeList.pending, (state,action)=>{
        state.loading = true;
        state.error = "";
      })
      .addCase(getLikeList.fulfilled, (state, action) => {
        state.loading = false;
        state.likeList = action.payload.data;
        state.success = true; 
      })
      .addCase(getLikeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
  }
})
export const {
  clearLike,
  clearErrors,
  clearSuccess
} = likeSlice.actions;

export default likeSlice.reducer;