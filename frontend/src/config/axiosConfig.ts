import Axios, { InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const token = localStorage.getItem("jwtToken");
  const parsedToken = token ? JSON.parse(token) : "";

  if (config.headers) {
    config.headers.Authorization = `Bearer ${parsedToken}`;
    config.headers.Accept =
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
  }

  return config;
}

const axios = Axios.create({
  baseURL: "http://localhost:3000/",
});

axios.interceptors.request.use(authRequestInterceptor);

export default axios;
