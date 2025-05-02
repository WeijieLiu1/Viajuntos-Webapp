import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://viajuntos-backend-284495715917.europe-southwest1.run.app/',
  // baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  },
});

export default axiosInstance;
