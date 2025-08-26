import axios from "axios";
const API = process.env.NEXT_PUBLIC_BACKEND_API;
const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
