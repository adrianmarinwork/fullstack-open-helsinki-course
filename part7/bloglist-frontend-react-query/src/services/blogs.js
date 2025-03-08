import axios from 'axios';
const baseUrl = '/api/blogs';
let apiToken = null;

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const saveBlog = async (blog) => {
  const config = {
    headers: { Authorization: apiToken },
  };

  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const updateBlog = async (blog) => {
  const config = {
    headers: { Authorization: apiToken },
  };

  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config);
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: apiToken },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.status;
};

const setApiToken = (apiTokenParam) => {
  apiToken = `Bearer ${apiTokenParam}`;
};

export default {
  getAll,
  saveBlog,
  setApiToken,
  updateBlog,
  deleteBlog,
  apiToken,
};
