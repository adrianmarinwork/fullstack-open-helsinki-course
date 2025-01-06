import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAnecdotes, updateAnecdote } from './requests';
import NotificationContext from './contexts/NotificationContext';

const App = () => {
  const [message, dispatch] = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    queryClient: () => queryClient.invalidateQueries('anecdotes'),
  });

  const handleVote = (anecdote) => {
    anecdote.votes += 1;
    updateAnecdoteMutation.mutate(anecdote);
    const message = `Anecdote '${anecdote.content}' voted`;
    dispatch({ type: 'SET_NOTIFICATION', payload: message });
    setTimeout(() => dispatch({ type: 'SET_NOTIFICATION', payload: '' }), 5000);
  };

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>Loading data...</div>;
  }

  if (result.isError) {
    return <div>Anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data ?? [];

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification message={message} />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
