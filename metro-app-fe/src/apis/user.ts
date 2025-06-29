import { ApiResponse } from "src/types/api.type";
import { RequestCreationRequest, RequestDto, User } from "src/types/user.type";
import http from "src/utils/http";

const userApiRequests = {
  me: () => http.get<ApiResponse<User>>("users/me"),

  request: (body: RequestCreationRequest) =>
    http.post<ApiResponse<RequestDto>>("users/requests", body),

  requestListByUser: (values: number) =>
    http.get<ApiResponse<RequestDto[]>>(`users/requests/${values}`),
};

export default userApiRequests;
