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
      console.log("Ticket type created successfully!");
    },
    onError: (error) => {
      console.error("Error creating ticket type:", error);
    },
  });
};

export const useUpdateTicketTypeMutation = () => {
  // const queryClient = useQueryClient();
  // return useMutation({
  //   mutationFn: ticketsApiRequests.updateTicketType,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["ticket-type"] });
  //   },
  // });
};

export const useDeleteTicketTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApiRequests.deleteTicketType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-type"] });
    },
  });
};

export const useGetTicketTypeById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["ticket-type", id],
    queryFn: () => ticketsApiRequests.ticketTypeById(id),
    enabled,
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

export const useUpdateTicketFareMatrixMutation = () => {
  // const queryClient = useQueryClient();
  // return useMutation({
  //   mutationFn: ticketsApiRequests.updateTicketFareMatrix,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["fare-matrices"] });
  //   },
  // });
};

export const useDeleteTicketFareMatrixMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApiRequests.deleteTicketFareMatrix,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fare-matrices"] });
    },
  });
};

export const useGetFareMatrixById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["fare-matrices", id],
    queryFn: () => ticketsApiRequests.fareMatrixById(id),
    enabled,
  });
};

export const useGetTicketById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => ticketsApiRequests.ticketById(id),
    enabled,
  });
};

export const useGetTicketQRCode = (ticketCode?: string) => {
  return useQuery({
    queryKey: ["tickets", ticketCode],
    queryFn: () => ticketsApiRequests.generateQR(ticketCode),
    enabled: !!ticketCode,
  });
};

export const useGetTicketByUser = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: ticketsApiRequests.ticketByUser,
  });
};

export const useGetUpgradeAmount = ({
  ticketId,
  endStationId,
}: {
  ticketId: number;
  endStationId: number;
}) => {
  return useQuery({
    queryKey: ["upgrade-amount", ticketId, endStationId],
    queryFn: () => ticketsApiRequests.getUpgradeAmount(ticketId, endStationId),
    enabled: !!ticketId && !!endStationId,
  });
}

export const useGetStationsForUpdate = ({
  ticketId,
}: {
  ticketId: number;
}) => {
  return useQuery({
    queryKey: ["stations-for-update", ticketId],
    queryFn: () => ticketsApiRequests.getStationsForUpdate(ticketId),
    enabled: !!ticketId,
  });
}
