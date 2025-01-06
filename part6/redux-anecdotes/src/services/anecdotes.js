import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

async function getAll() {
  const response = await axios.get(baseUrl);
  return response.data;
}

async function addNewAnecdote(content) {
  const anecdote = { content, votes: 0 };
  const response = await axios.post(baseUrl, anecdote);
  return response.data;
}

export default { getAll, addNewAnecdote };
