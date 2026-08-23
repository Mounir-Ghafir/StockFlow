import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('stockflow_token') || '',
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem('stockflow_token', action.payload.token);
    },
    logout: (state) => {
      state.token = '';
      state.user = null;
      state.error = null;
      localStorage.removeItem('stockflow_token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, setUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
