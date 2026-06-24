import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5020/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT en las cabeceras
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
