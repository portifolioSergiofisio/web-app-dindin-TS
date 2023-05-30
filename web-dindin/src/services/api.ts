import axios, { AxiosInstance } from "axios";

const axiosPrivate: Readonly<AxiosInstance> = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default axiosPrivate;

