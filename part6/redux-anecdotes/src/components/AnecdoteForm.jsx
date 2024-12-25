import { useDispatch } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const submitCreateNew = (event) => {
    event.preventDefault();
    const anecdoteText = event.target.anecdote.value;
    event.target.anecdote.value = '';
    dispatch(addAnecdote(anecdoteText));
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
