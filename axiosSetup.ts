import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const api = axios.create({
  baseURL: "/.netlify/functions",
})

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${API_KEY}`,
//   },
// });
