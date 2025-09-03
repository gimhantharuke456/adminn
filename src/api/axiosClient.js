import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://13.51.166.224:3002",
});

export default axiosClient;
