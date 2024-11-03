import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post('/cart',{productId:id,size,qty:1})
      if(res.status!==200) throw new Error(res.error)
        dispatch(showToastMessage({message:"카트에 아이템이 추가 됐습니다.",status:"success"}))
      return res.data.cartItemQty
    } catch (error) {
      dispatch(showToastMessage({message:"이미 동일 상품이 카트에 있습니다.",status:"error"}))
      return rejectWithValue(error.error)      
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get('/cart')
      if(res.status!==200) throw new Error(res.error)
        return res.data.data
    } catch (error) {
      return rejectWithValue(error.error)      
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.delete(`/cart/${id}`)
      if(res.status!==200) throw new Error(res.error)
        dispatch(showToastMessage({message:"카트에 아이템이 삭제 됐습니다.",status:"success"}))
      return res.data.cartItemQty
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {}
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {}
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
    .addCase(addToCart.pending,(state,action)=>{
      state.loading = true
    })
    .addCase(addToCart.fulfilled,(state,action)=>{
      state.loading = false
      state.error = ""
      state.cartItemCount = action.payload
    })
    .addCase(addToCart.rejected,(state,action)=>{
      state.loading = false
      state.error = action.payload
    })
    .addCase(getCartList.pending,(state,action)=>{
      state.loading = true
    })
    .addCase(getCartList.fulfilled,(state,action)=>{
      state.loading = false
      state.error = ""
      state.cartList = action.payload
      state.totalPrice = action.payload.reduce((total,item)=>total+item.productId.price*item.qty,0)
    })
    .addCase(getCartList.rejected,(state,action)=>{
      state.loading = false
      state.error = action.payload
    })
    .addCase(deleteCartItem.pending,(state,action)=>{
      state.loading = true
    })
    .addCase(deleteCartItem.fulfilled,(state,action)=>{
      state.loading = false
      state.error = ""
      state.cartItemCount = action.payload
    })
    .addCase(deleteCartItem.rejected,(state,action)=>{
      state.loading = false
      state.error = action.payload
    })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
