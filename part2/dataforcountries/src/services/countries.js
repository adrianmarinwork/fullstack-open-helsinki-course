import axios from "axios";

const baseUrl = `https://studies.cs.helsinki.fi/restcountries`;

async function getAllCountries() {
  const response = await axios.get(`${baseUrl}/api/all`);
  return response.data;
}

async function findCountry(searchText) {
  const response = await axios.get(`${baseUrl}/api/name/${searchText}`);
  return response.data;
}

export default { getAllCountries, findCountry };
