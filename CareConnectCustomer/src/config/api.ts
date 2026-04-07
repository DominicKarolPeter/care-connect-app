import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.1.100:5000/api", // ✅ Replace with your backend IP + port
  timeout: 10000,
});
