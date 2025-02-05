import { useSelector } from 'react-redux';

const Notification = () => {
  const { message, isError } = useSelector((state) => state.notification);
  const alertStyles = {
    color: isError ? 'red' : 'green',
    borderColor: isError ? 'red' : 'green',
    background: 'lightgrey',
    padding: 10,
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    marginBottom: 10,
  };

  if (!message) {
    return null;
  }

  return <div style={alertStyles}>{message}</div>;
};

export default Notification;
