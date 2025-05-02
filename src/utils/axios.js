import axios from 'axios';

const axiosInstance = axios.create({
//   baseURL: 'https://socialout-production.herokuapp.com',
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  },
});

export default axiosInstance;
