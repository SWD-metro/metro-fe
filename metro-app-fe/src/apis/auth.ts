import { ApiResponse } from "src/types/api.type";
import {
  LocalLoginRequest,
  OtpRequest,
  VerifyOtpRequest,
} from "src/types/auth.type";
import { RegisterRequest, User } from "src/types/user.type";
import http from "src/utils/http";

const authApiRequests = {
  login: (body: LocalLoginRequest) =>
    http.post<ApiResponse<User>>("auth/local-login", body),
  logout: () => http.post("auth/logout", null),
  register: (body: RegisterRequest) =>
    http.post<ApiResponse<User>>("users/register", body),
  checkEmail: (value: string) =>
    http.get<ApiResponse>("users/is-email-exist", {
      params: { email: value },
    }),
  checkUserName: (value: string) =>
    http.get<ApiResponse>("users/is-username-exist", {
      params: { username: value },
    }),
  verifyOtp: (body: VerifyOtpRequest) =>
    http.post<ApiResponse>("notifications/verify-otp", null, {
      params: body,
    }),
  sendOtp: (body: OtpRequest) =>
    http.post<ApiResponse>("notifications/send-otp", body),
};

export default authApiRequests;
