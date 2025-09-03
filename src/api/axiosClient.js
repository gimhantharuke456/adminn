import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3002",
});

export default axiosClient;
