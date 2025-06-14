import { ApiResponse } from "src/types/api.type";
import { LocalLoginRequest } from "src/types/auth.type";
import { User } from "src/types/user.type";
import http from "src/utils/http";

const authApiRequests = {
  login: (body: LocalLoginRequest) =>
    http.post<ApiResponse<User>>("auth/local-login", body),
  logout: () => http.post("auth/logout", null),
};

export default authApiRequests;
