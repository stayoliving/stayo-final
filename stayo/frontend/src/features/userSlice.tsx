import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      console.log("Login action triggered with payload:", action);
      state.userDetails = action.payload;
    },
    // loginRequest: (state) => {
    //     state.loading = true;
    //     state.error = null;
    // },
    // loginSuccess: (state, action) => {
    //     state.loading = false;
    //     state.isAuthenticated = true;
    //     state.user = action.payload;
    // },
    // loginFailure: (state, action) => {
    //     state.loading = false;
    //     state.isAuthenticated = false;
    //     state.error = action.payload;
    // },
    logout: (state) => {
      state.userDetails = null;
      state.isAuthenticated = false;
    },
  },
});
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
