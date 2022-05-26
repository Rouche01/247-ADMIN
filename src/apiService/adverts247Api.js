import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://frozen-escarpment-07199.herokuapp.com/api"
      : "/api",
});

export default instance;
