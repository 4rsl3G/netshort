import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_PROXY_BASE,
  timeout: 15000,
});