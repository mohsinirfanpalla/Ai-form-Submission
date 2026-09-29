import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const TOKEN_KEY = "formly_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) =>
  localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () =>
  localStorage.removeItem(TOKEN_KEY);

// Add token to every request
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle API errors
api.interceptors.response.use(
  (res) => res,

  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      error.message ||
      "Network error — is the backend running?";

    if (status === 401 && getToken()) {
      clearToken();

      if (
        !["/login", "/register"].includes(
          window.location.pathname
        )
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject({
      ...error,
      message,
      details: error.response?.data?.details,
    });
  }
);

export default api;