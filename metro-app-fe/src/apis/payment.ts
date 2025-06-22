import { ApiResponse } from "src/types/api.type";
import {
  PaymentCallbackResponse,
  PaymentMethodResponse,
  PaymentResponse,
} from "src/types/orders.type";
import http from "src/utils/http";

const paymentApiRequests = {
  createVnPayPayment: (value: number) =>
    http.post<ApiResponse<PaymentResponse>>("payment/create", null, {
      params: { orderInfo: value },
    }),
  paymentMethodList: () =>
    http.get<ApiResponse<PaymentMethodResponse[]>>(
      "orders/payment-methods/get-all"
    ),
  vnPayCallBack: (query: string) =>
    http.get<ApiResponse<PaymentCallbackResponse>>(`payment/callback${query}`),
};

export default paymentApiRequests;
