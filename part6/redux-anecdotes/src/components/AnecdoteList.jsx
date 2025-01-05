import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import {
  setNotification,
  removeNotification,
} from '../reducers/notificationReducer';

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

  const vote = (id) => {
    dispatch(voteAnecdote(id));
    const anecdote = anecdotes.find((a) => a.id === id);
    const message = `You voted '${anecdote.content}'`;
    dispatch(setNotification(message));
    setTimeout(() => dispatch(removeNotification()), 5000);
  };

  anecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
