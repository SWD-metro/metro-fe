import { ApiResponse } from "src/types/api.type";
import {
  OrderDetailResponse,
  OrderResponse,
  OrderTicketDaysRequest,
  OrderTicketSingleRequest,
} from "src/types/orders.type";
import http from "src/utils/http";

const orderApiRequests = {
  createOrderSingle: (body: OrderTicketSingleRequest) =>
    http.post<ApiResponse<OrderResponse>>("orders/create/single", body),

  createOrderDays: (body: OrderTicketDaysRequest) =>
    http.post<ApiResponse<OrderResponse>>("orders/create/days", body),

  orderByUser: () => {
    return http.get<ApiResponse<OrderResponse[]>>(`orders/user`);
  },

  orderDetailByUser: () =>
    http.get<ApiResponse<OrderDetailResponse[]>>("orders/user/details"),
};

export default orderApiRequests;
