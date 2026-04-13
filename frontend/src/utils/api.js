import axios from 'axios';

/**
 * Axios instance với baseURL động
 * - Production: gọi trực tiếp tới backend Render
 * - Development: gọi qua Vite proxy (cùng origin)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default api;
