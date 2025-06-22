import { ApiResponse } from "src/types/api.type";
import { User } from "src/types/user.type";
import http from "src/utils/http";

const userApiRequests = {
  me: () => http.get<ApiResponse<User>>("users/me"),
};

export default userApiRequests;
