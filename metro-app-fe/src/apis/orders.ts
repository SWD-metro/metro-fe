import { ApiResponse } from "src/types/api.type";
import {
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

  orderByUser: (value: number) => {
    return http.get<ApiResponse<OrderResponse[]>>(`orders/user/${value}`);
  },
};

export default orderApiRequests;
