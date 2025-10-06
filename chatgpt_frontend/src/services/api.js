import axios from "axios";

const API = axios.create({
  baseURL: "https://chat-ai-1-gq5q.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});


export default API;