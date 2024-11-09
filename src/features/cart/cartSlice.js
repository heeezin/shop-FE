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
      const res = await api.post("/cart", { productId: id, size, qty: 1 });
      dispatch(
        showToastMessage({
          message: "카트에 아이템이 추가 됐습니다.",
          status: "success",
        })
      );
      dispatch(getCartList());
      return res.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error,
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    if (!state.user.user) return;
    try {
      const res = await api.get("/cart");
      console.log("getCartList", res.data.data);

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.delete(`/cart/${id}`, { params: { size } });
      dispatch(
        showToastMessage({
          message: "카트에 아이템이 삭제 됐습니다.",
          status: "success",
        })
      );
      dispatch(getCartList());
      console.log("deleteCartItem", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, size, qty }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.patch("/cart/editQty", {
        productId: id,
        size,
        qty,
      });
      dispatch(getCartList());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get("/cart/qty");
      if (!res.status === 200) throw new Error(res.error);
      return res.data.qty;
    } catch (error) {
      dispatch(showToastMessage({ message: error, status: "error" }));
      return rejectWithValue(error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartList = [];
      state.cartItemCount = 0;
      state.totalPrice = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        if (action.payload.status === "success") {
          state.cartItemCount += 1;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload || [];
        state.totalPrice = state.cartList.length
          ? state.cartList.reduce(
              (total, item) => total + (item.productId.price * item.qty || 0),
              0
            )
          : 0;
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload.data;
        state.cartItemCount = state.cartList.reduce(
          (count, item) => count + item.qty,
          0
        );
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQty.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload.data.items;
        state.totalPrice = action.payload.data.items.reduce(
          (total, item) => total + item.qty * item.productId.price,
          0
        );
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartQty.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
