import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import paymentApiRequests from "src/apis/payment";

export const useCreateVNPayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApiRequests.createVnPayPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vnpay"] });
    },
  });
};

export const useGetVNPayCallback = () => {
  return useQuery({
    queryKey: ["vnpay"],
    queryFn: paymentApiRequests.vnPayCallBack,
  });
};

export const useGetPaymentMethodList = () => {
  return useQuery({
    queryKey: ["payment-method"],
    queryFn: paymentApiRequests.paymentMethodList,
  });
};
