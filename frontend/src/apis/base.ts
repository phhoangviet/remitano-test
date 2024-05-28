import axios from "axios";
// import { getLocalToken, removeLocalToken } from "../utils/localStorage";
import { api } from "../constants/configs";

const requestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: `${api}`,
  timeout: 90000,
};

const axiosInstance = axios.create(requestConfig);
axiosInstance.defaults.withCredentials = true;
const axiosExternalInstance = axios.create();

axiosInstance.interceptors.request.use(async (config) => {
  // const token = window.localStorage.getItem("token");

  // if (token) {
  //   Object.assign(config.headers, {
  //     Authorization: `Bearer ${token}`,
  //   });
  // }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 404) {
      window.localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosExternalInstance };
