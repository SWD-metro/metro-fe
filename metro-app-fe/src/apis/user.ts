import { ApiResponse } from "src/types/api.type";
import {
  Feedback,
  FeedbackCreationRequest,
  FeedbackReply,
  RequestCreationRequest,
  RequestDto,
  User,
  VerifyRequestParams,
} from "src/types/user.type";
import http from "src/utils/http";

const userApiRequests = {
  me: () => http.get<ApiResponse<User>>("users/me"),
  userList: () => http.get<ApiResponse<User[]>>("users"),

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
  createFeedback: (body: FeedbackCreationRequest) =>
    http.post<ApiResponse<Feedback>>("users/feedbacks", body),
  feedbackListByUser: (values: number) =>
    http.get<ApiResponse<Feedback[]>>(`users/feedbacks/${values}`),
  feedbackList: () => http.get<ApiResponse<Feedback[]>>("users/feedbacks"),

  feedbackReply: (body: FeedbackReply) =>
    http.post<ApiResponse<Feedback>>("users/feedbacks/reply", body),
};

export default userApiRequests;
