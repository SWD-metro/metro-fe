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

export const useGetVNPayCallback = (search: string) => {
  return useQuery({
    queryKey: ["vnpay", search],
    queryFn: () => paymentApiRequests.vnPayCallBack(search),
    enabled: !!search,
  });
};

export const useGetPaymentMethodList = () => {
  return useQuery({
    queryKey: ["payment-method"],
    queryFn: paymentApiRequests.paymentMethodList,
  });
};

export const useCreateVNPayUpgradeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, endStationId }: { ticketId: number, endStationId: number }) => 
      paymentApiRequests.createVnPayPaymentForUpgrade(ticketId, endStationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vnpay-upgrade"] });
    },
  });
};

export const useGetVNPayUpgradeCallback = (search: string) => {
  return useQuery({
    queryKey: ["vnpay-upgrade", search],
    queryFn: () => paymentApiRequests.paymentUpgradeCallBack(search),
    enabled: !!search,
  });
};
