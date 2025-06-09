import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajusta la URL según la configuración de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Cambia el almacenamiento si usas otra estrategia
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor para manejar errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Manejo de errores de autenticación (opcional)
      console.error('No autorizado. Redirigiendo al inicio de sesión...');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
