import axios from "axios";

const API = process.env.REACT_APP_API || "https://lead-crm-1.onrender.com";

const instance = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const api = {
  get: (url) => instance.get(url).then((res) => res.data),
  post: (url, data) => instance.post(url, data).then((res) => res.data),
  put: (url, data) => instance.put(url, data).then((res) => res.data),
  delete: (url) => instance.delete(url).then((res) => res.data),
};
