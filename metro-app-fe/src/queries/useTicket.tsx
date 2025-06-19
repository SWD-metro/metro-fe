import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ticketsApiRequests from "src/apis/ticket";

export const useGetTicketTypeList = () => {
  return useQuery({
    queryKey: ["ticket-type"],
    queryFn: ticketsApiRequests.ticketTypeList,
  });
};

export const useCreateTicketTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApiRequests.createTicketType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-type"] });
    },
  });
};

export const useGetFareMatricesList = () => {
  return useQuery({
    queryKey: ["fare-matrices"],
    queryFn: ticketsApiRequests.fareMatricesList,
  });
};

export const useCreateTicketFareMatrixMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApiRequests.createTicketFareMatrix,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fare-matrices"] });
    },
  });
};

export const useGetTicketById = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => ticketsApiRequests.ticketById(id),
  });
};

export const useGetTicketQRCode = (ticketCode?: string) => {
  return useQuery({
    queryKey: ["tickets", ticketCode],
    queryFn: () => ticketsApiRequests.generateQR(ticketCode as string),
    enabled: !!ticketCode,
  });
};
