import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on 401 Unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
