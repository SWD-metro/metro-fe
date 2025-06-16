/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, type AxiosInstance } from "axios";
import { ApiResponse } from "src/types/api.type";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:4003/api/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        return response;
      },
      function (error) {
        if (error) {
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          console.log(message);
        }
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;
export default http;
