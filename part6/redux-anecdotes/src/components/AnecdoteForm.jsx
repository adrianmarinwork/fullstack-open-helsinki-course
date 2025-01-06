import { useDispatch } from 'react-redux';

import { addAnecdote } from '../reducers/anecdoteReducer';
import anecdoteService from '../services/anecdotes';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const submitCreateNew = async (event) => {
    event.preventDefault();
    const anecdoteText = event.target.anecdote.value;
    event.target.anecdote.value = '';
    const newAnecdote = await anecdoteService.addNewAnecdote(anecdoteText);
    dispatch(addAnecdote(newAnecdote));
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
