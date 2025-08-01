import axios from 'axios';

const API = axios.create({
  baseURL: `${REACT_APP_API_URL}`, 
  withCredentials: true,
});

export default API;
