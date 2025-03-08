import axios from 'axios';
const baseUrl = '/api/users';
let apiToken = '';

const getAll = () => {
  const config = {
    headers: { Authorization: apiToken },
  };

  const request = axios.get(baseUrl, config);
  return request.then((response) => response.data);
};

const setApiToken = (apiTokenParam) => {
  apiToken = `Bearer ${apiTokenParam}`;
};

export default { getAll, setApiToken };
