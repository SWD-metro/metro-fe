import { ApiResponse } from "src/types/api.type";
import { PaymentResponse } from "src/types/orders.type";
import http from "src/utils/http";

const paymentApiRequests = {
  createPayment: (value: number) =>
    http.post<ApiResponse<PaymentResponse>>("payment/create", null, {
      params: { orderInfo: value },
    }),
};

export default paymentApiRequests;
