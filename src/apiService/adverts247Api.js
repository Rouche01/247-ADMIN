import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://frozen-escarpment-07199.herokuapp.com/",
});

export default instance;
