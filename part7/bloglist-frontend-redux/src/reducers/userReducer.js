import { createSlice } from '@reduxjs/toolkit';

import loginService from '../services/login';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    updateUser(state, action) {
      return action.payload;
    },
    logoutUser(state, action) {
      return null;
    },
  },
});

export const { updateUser, logoutUser } = userSlice.actions;

export function loginUser(user) {
  return async (dispatch) => {
    const apiUser = await loginService.login(user);
    dispatch(updateUser(apiUser));
    return apiUser;
  };
}

export default userSlice.reducer;
