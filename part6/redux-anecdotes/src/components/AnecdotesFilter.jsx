import { useDispatch } from 'react-redux';
import { filterByText } from '../reducers/filterReducer';

const AnecdotesFilter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const value = event.target.value;
    dispatch(filterByText(value));
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default AnecdotesFilter;
