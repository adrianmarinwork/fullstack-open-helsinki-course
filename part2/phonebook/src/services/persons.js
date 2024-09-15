import axios from "axios";
const baseUrl = "/api/persons";
// const baseUrl = "https://fullstack-open-helsinki-course-part3.onrender.com/api/persons";

async function getAll() {
  const response = await axios.get(baseUrl);
  return response.data;
}

async function create(newPerson) {
  const response = await axios.post(baseUrl, newPerson);
  return response.data;
}

async function update(id, newPerson) {
  const response = await axios.put(`${baseUrl}/${id}`, newPerson);
  return response.data;
}

async function deletePerson(id) {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
}

export default { getAll, create, update, deletePerson };
