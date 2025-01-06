import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    updateNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  },
});

export const { updateNotification, clearNotification } =
  notificationSlice.actions;

export function setNotification(message, timeoutSeconds) {
  return (dispatch) => {
    dispatch(updateNotification(message));
    setTimeout(() => dispatch(clearNotification()), timeoutSeconds);
  };
}

export default notificationSlice.reducer;
