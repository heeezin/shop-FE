import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/user/login',{email,password})
      sessionStorage.setItem("token", res.data.token)
      api.defaults.headers["Authorization"] = "Bearer " + res.data.token;
      dispatch(showToastMessage({message: "로그인 되었습니다!", status:"login success"}))
      return res.data.user
    } catch (error) {
      // dispatch(showToastMessage({message:"로그인 실패 했습니다.", status:"error"}))
      return rejectWithValue(error.message)
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/google", {token})
      sessionStorage.setItem("token", res.data.token)
        return res.data.user
    } catch (error) {
        return rejectWithValue(error.message)
    }
  }
);

export const logout = () => (dispatch) => {
  sessionStorage.removeItem("token")
  dispatch(clearUser())
  dispatch(initialCart())
};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await api.post('/user',{email,password,name})
      //1.성공 메시지 2.로그인 페이지로 이동
      dispatch(showToastMessage({message:"회원가입을 성공했습니다!",status:"success"}))
      navigate('/login')
      return res.data.data
    } catch (error) {
      //1.실패 메시지 2.에러값을 저장해서 보여준다.
      dispatch(showToastMessage({message:"회원가입에 실패 했습니다.",status:"error"}))
      return rejectWithValue(error.error)
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token"); 
    if (!token) {
      return rejectWithValue("토큰X");
    }
      try {
        const res = await api.get('/user/account');
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    clearUser: (state) => {
      state.user = null; 
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending,(state)=>{
      state.loading = true
    })
    .addCase(registerUser.fulfilled,(state)=>{
      state.loading = false
      state.registrationError = null
    })
    .addCase(registerUser.rejected,(state,action)=>{
      state.loading = false
      state.registrationError = action.payload
    })
    .addCase(loginWithEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginWithEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.loginError = null;
    })
    .addCase(loginWithEmail.rejected, (state, action) => {
      state.loading = false;
      state.loginError = action.payload;
    })
    .addCase(loginWithToken.fulfilled,(state, action)=>{
      state.user = action.payload.user
    })
    .addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.loginError = null;
    })
    .addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.loginError = action.payload;
    })
  },
});
export const { clearErrors, clearUser } = userSlice.actions;
export default userSlice.reducer;
