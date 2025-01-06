import { useSelector, useDispatch } from 'react-redux';
import { updateAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  let anecdotes = useSelector(function (state) {
    if (!state.filter) {
      return state.anecdotes;
    }

    return state.anecdotes.filter((anecdote) =>
      anecdote.content.includes(state.filter)
    );
  });

  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(updateAnecdote(anecdote));

    const message = `You voted '${anecdote.content}'`;
    dispatch(setNotification(message, 5000));
  };

  anecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
