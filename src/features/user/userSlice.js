import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/user/login',{email,password})
      dispatch(showToastMessage({message: "로그인 되었습니다!", status:"login success"}))
      navigate('/')
      return res.data.data
    } catch (error) {
      dispatch(showToastMessage({message:"로그인 실패 했습니다.", status:"error"}))
      return rejectWithValue(error.error)
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};
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
  async (_, {rejectWithValue}) => {
    try {
      const storedToken = sessionStorage.getItem('token')
      if(storedToken) {
        const res = await api.get('/user/account')
        return res.data.user
      }
    } catch (error) {
      return rejectWithValue(error.error)
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
      state.registrationError = action.payload
    })
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
