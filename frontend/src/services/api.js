import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("wc_token");
      localStorage.removeItem("wc_user");
    }
    return Promise.reject(error);
  }
);

export default api;
