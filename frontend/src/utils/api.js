import axios from 'axios';
import { BACKEND_URL } from './constant'; 

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// This is the interceptor that automatically adds the login token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;