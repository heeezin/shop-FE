import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get("/product", {params: {...query}});
      console.log('rrr',res)
      if (res.status !== 200) throw new Error(res.error);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/product/${id}`)
      if(res.status!==200) throw new Error(res.error)
        return res.data.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/product", formData);
      if (res.status !== 200) throw new Error(res.error);
      dispatch(
        showToastMessage({ message: "상품 생성 완료", status: "success" })
      );
      dispatch(getProductList({page:1}))
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (payload, { dispatch, rejectWithValue }) => {
    const {id,page} = payload
    try {
      const res = await api.delete(`/product/${id}`)
      if(res.status!==200) throw new Error(res.error)
      dispatch(getProductList({page}))
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.error)      
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id,page, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/product/${id}`,formData)
      if(res.status!==200) throw new Error(res.error)
        dispatch(getProductList({page}))
        return res.data.data  
    } catch (error) {
        return rejectWithValue(error.error)      
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true; //상품 생성을 성공하면 다이얼로그 닫고, 실패는 메시지 다이얼로그 보여주고 닫진 않음
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
        state.error = "";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending,(state,action)=>{
        state.loading = true;
      })
      .addCase(editProduct.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(editProduct.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteProduct.pending,(state,action)=>{
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(deleteProduct.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductDetail.pending,(state,action)=>{
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = "";
        state.selectedProduct = action.payload;
      })
      .addCase(getProductDetail.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { setSelectedProduct, setFilteredList, clearError, clearSuccess } =
  productSlice.actions;
export default productSlice.reducer;