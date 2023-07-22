import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    username: '',
    course: '', // New state for the selected course
    year: '', // New state for the selected year
    
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = '';
    },
    selectCourse: (state, action) => {
      state.course = action.payload;
    },
    selectYear: (state, action) => {
      state.year = action.payload;
    },
  },
});

export const { login, logout, selectCourse, selectYear } = AuthSlice.actions;

export default AuthSlice.reducer;
