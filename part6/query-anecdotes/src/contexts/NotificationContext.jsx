import { createContext, useReducer } from 'react';

const notificationReducer = (state, action) => {
  switch (action) {
    case 'SET_NOTIFICATION':
      return action.payload;
    default:
      return action.payload;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
