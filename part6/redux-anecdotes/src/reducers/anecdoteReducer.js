import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    updateAnecdotes(state, action) {
      const anecdoteUpdated = action.payload;
      const updatedState = state.map((anecdote) =>
        anecdote.id === anecdoteUpdated.id ? anecdoteUpdated : anecdote
      );
      return updatedState;
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdotes } =
  anecdoteSlice.actions;

export function initializeAnecdotes() {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
}

export function addAnecdote(content) {
  return async (dispatch) => {
    const anecdote = await anecdoteService.addNewAnecdote(content);
    dispatch(appendAnecdote(anecdote));
  };
}

export function updateAnecdote(anecdote) {
  return async (dispatch) => {
    const anecdoteUpdated = { ...anecdote, votes: anecdote.votes + 1 };
    await anecdoteService.updateAnecdote(anecdoteUpdated);
    dispatch(updateAnecdotes(anecdoteUpdated));
  };
}

export default anecdoteSlice.reducer;
