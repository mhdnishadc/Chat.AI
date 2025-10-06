import axios from "axios";

const API = axios.create({
  baseURL: "https://chat-ai-1-p4go.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});


export default API;