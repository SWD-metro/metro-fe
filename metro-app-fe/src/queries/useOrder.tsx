import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useGetOrderByUserId = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApiRequests.orderByUser(id),
    enabled,
  });
};
