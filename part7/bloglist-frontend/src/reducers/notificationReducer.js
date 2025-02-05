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

export function setNotification(notification, timeoutSeconds) {
  return (dispatch) => {
    dispatch(updateNotification(notification));
    setTimeout(() => dispatch(updateNotification('')), timeoutSeconds);
  };
}

export default notificationSlice.reducer;
