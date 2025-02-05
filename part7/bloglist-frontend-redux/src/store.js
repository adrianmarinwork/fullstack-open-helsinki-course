import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './reducers/notificationReducer';
import blogPostReducer from './reducers/blogPostReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogPosts: blogPostReducer,
    user: userReducer,
  },
});

export default store;
