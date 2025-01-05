import AnecdoteList from './components/AnecdoteList';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdotesFilter from './components/AnecdotesFilter';
import Notification from './components/Notification';

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdotesFilter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
