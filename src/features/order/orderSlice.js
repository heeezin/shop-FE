import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/order",payload)
        dispatch(getCartQty())
        return res.data.orderNum
    } catch (error) {
      dispatch(showToastMessage({message: error.error, status: "error"}))
      return rejectWithValue(error.error)
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (query = {}, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get('/order/all', { params: {...query} });
      console.log("API response:", res.data);
      return res.data.orders;
    } catch (error) {
      dispatch(showToastMessage({ message: error.message, status: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  // async (query, { rejectWithValue, dispatch }) => {
  //   try {
  //     const res = await api.get('/order/search',{params: {orderNum : query.orderNum}})
  //     if (res.status !== 200) throw new Error(res.error);
  //     return res.data.order? [res.data.order] : [];
  //   } catch (error) {
  //     dispatch(showToastMessage({ message: error.message, status: "error" }));
  //     return rejectWithValue(error.message);
  //   }
  // }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
    async ({ id, status }, { dispatch, rejectWithValue }) => {
      try {
        const res = await api.put(`/order/${id}/status`, { status }); // 주문 ID와 새로운 상태를 보냄
        dispatch(showToastMessage({ message: "오더 상태가 변경되었습니다.", status: "success" }));
        return { id, status }
      } catch (error) {
        dispatch(showToastMessage({ message: error.message, status: "error" }));
        return rejectWithValue(error.message);
      }
    }
);
const updateOrderStatus = (state, id, status) => {
  state.orderList = state.orderList.map((order) =>
    order._id === id ? { ...order, status } : order
  );
  if (state.selectedOrder && state.selectedOrder._id === id) {
    state.selectedOrder.status = status;
  }
};
// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createOrder.pending,(state,action)=>{
      state.loading = true
    })
    .addCase(createOrder.fulfilled,(state,action)=>{
      state.loading = false
      state.error = ""
      state.orderNum = action.payload
    })
    .addCase(createOrder.rejected,(state,action)=>{
      state.loading = false
      state.error = action.payload
    })
    .addCase(getOrder.pending, (state) => {
      state.loading = true;
    })
    .addCase(getOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orderList = action.payload;
    })
    .addCase(getOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateOrder.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateOrder.fulfilled, (state, action) => {
      state.loading = false;
      const { id, status } = action.payload;
      updateOrderStatus(state, id, status);
    })
    .addCase(updateOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
