import axios from "axios";

// https://frozen-escarpment-07199.herokuapp.com/api
// http://localhost:3005/api

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://api.adverts247.com/api"
      : "https://api.adverts247.com/api",
});

export default instance;
