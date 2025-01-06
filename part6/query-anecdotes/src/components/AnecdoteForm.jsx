import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { newAnecdote } from '../requests';
import NotificationContext from '../contexts/NotificationContext';

const AnecdoteForm = () => {
  const [message, dispatch] = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: newAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
  });

  const onCreateSuccess = (anecdote) => {
    const message = `New anecdote created: '${anecdote.content}'`;
    dispatch({ type: 'SET_NOTIFICATION', payload: message });
    setTimeout(() => dispatch({ type: 'SET_NOTIFICATION', payload: '' }), 5000);
  };

  const onCreateError = () => {
    const message = `To short anecdote, must have length 5 or more.`;
    dispatch({ type: 'SET_NOTIFICATION', payload: message });
    setTimeout(() => dispatch({ type: 'SET_NOTIFICATION', payload: '' }), 5000);
  };

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      { onError: onCreateError, onSuccess: onCreateSuccess }
    );
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
