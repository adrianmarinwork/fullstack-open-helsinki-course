import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAnecdotes, updateAnecdote } from './requests';

const App = () => {
  const queryClient = useQueryClient();

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    queryClient: () => queryClient.invalidateQueries('anecdotes'),
  });

  const handleVote = (anecdote) => {
    console.log('vote');
    anecdote.votes += 1;
    updateAnecdoteMutation.mutate(anecdote);
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

  console.log('result: ', JSON.parse(JSON.stringify(result)));

  const anecdotes = result.data ?? [];

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
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
