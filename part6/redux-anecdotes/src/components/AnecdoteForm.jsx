import { useDispatch } from 'react-redux';

import { addAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const submitCreateNew = async (event) => {
    event.preventDefault();
    const anecdoteText = event.target.anecdote.value;
    event.target.anecdote.value = '';
    dispatch(addAnecdote(anecdoteText));

    const message = `New anecdote added: '${anecdoteText}'`;
    dispatch(setNotification(message, 5000));
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={submitCreateNew}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
