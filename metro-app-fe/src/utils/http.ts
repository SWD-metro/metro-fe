/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, type AxiosInstance } from "axios";
import { ResponseApi } from "src/types/api.type";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:4004/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        //   config sau khi co token auth nha
        //   const accessToken = localStorage.getItem("access_token");
        //   if (accessToken) {
        //     config.headers.Authorization = `Bearer ${accessToken}`;
        //   }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseApi<any>>) => {
        return response;
      },
      function (error) {
        if (error) {
          const data: any | undefined = error.response?.data;
          const message = data.message || error.message;
          console.log(message);
        }
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;
export default http;
