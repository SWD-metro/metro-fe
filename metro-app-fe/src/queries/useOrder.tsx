import { useMutation, useQueryClient } from "@tanstack/react-query";
import orderApiRequests from "src/apis/orders";

export const useCreateOrderSingleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApiRequests.createOrderSingle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useCreateOrderDaysMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApiRequests.createOrderDays,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
