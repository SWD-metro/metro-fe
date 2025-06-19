import { useMutation, useQueryClient } from "@tanstack/react-query";
import paymentApiRequests from "src/apis/payment";

export const useCreatePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApiRequests.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
    },
  });
};
