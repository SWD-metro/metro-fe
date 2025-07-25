/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, type AxiosInstance } from "axios";
import { ApiResponse } from "src/types/api.type";

class HttpT {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:4010/api/",
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
          if (error.response?.status === 401) {
            console.error(
              "Unauthorized - token có thể hết hạn hoặc không hợp lệ"
            );
          } else if (error.response?.status === 403) {
            console.error("Forbidden - không có quyền truy cập");
          } else {
            console.error(message);
          }
        }
        return Promise.reject(error);
      }
    );
  }
}
const httpT = new HttpT().instance;
export default httpT;
