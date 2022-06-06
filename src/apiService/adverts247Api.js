import axios from "axios";

// https://frozen-escarpment-07199.herokuapp.com/api

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3005/api"
      : "/api",
});

export default instance;
