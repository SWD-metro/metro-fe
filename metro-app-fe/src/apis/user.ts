import { ApiResponse } from "src/types/api.type";
import {
  RequestCreationRequest,
  RequestDto,
  User,
  VerifyRequestParams,
} from "src/types/user.type";
import http from "src/utils/http";

const userApiRequests = {
  me: () => http.get<ApiResponse<User>>("users/me"),
  userByUserId: (value: number) =>
    http.get<ApiResponse<User>>(`users/${value}`),
  request: (body: RequestCreationRequest) =>
    http.post<ApiResponse<RequestDto>>("users/requests", body),
  requestListByUser: (values: number) =>
    http.get<ApiResponse<RequestDto[]>>(`users/requests/${values}`),
  requestList: () => http.get<ApiResponse<RequestDto[]>>("users/requests"),
  verifyRequest: (params: VerifyRequestParams) =>
    http.post<ApiResponse>("users/requests/verify", null, {
      params,
    }),
};

export default userApiRequests;
