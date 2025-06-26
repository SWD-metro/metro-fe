import { ApiResponse } from "src/types/api.type";
import { FareMatrixResponse } from "src/types/fares.type";
import { OrderDetailResponse } from "src/types/orders.type";
import {
  TicketResponse,
  TicketTypeRequest,
  TicketTypeResponse,
} from "src/types/tickets.type";
import http from "src/utils/http";

const ticketsApiRequests = {
  ticketTypeList: () =>
    http.get<ApiResponse<TicketTypeResponse[]>>("ts/ticket-types"),

  createTicketType: (data: TicketTypeRequest) =>
    http.post<ApiResponse<TicketTypeResponse>>("ts/ticket-types", data),

  ticketTypeById: (value: number) =>
    http.get<ApiResponse<TicketTypeResponse>>(`ts/ticket-types/${value}`),

  updateTicketType: (
    id: number,
    data: Omit<TicketTypeResponse, "id" | "createdAt" | "updatedAt">
  ) => http.put<ApiResponse<TicketTypeResponse>>(`ts/ticket-types/${id}`, data),

  deleteTicketType: (id: number) =>
    http.delete<ApiResponse>(`ts/ticket-types/${id}`),

  fareMatricesList: () =>
    http.get<ApiResponse<FareMatrixResponse[]>>("ts/fare-matrices"),
  createTicketFareMatrix: (value: number | undefined) =>
    http.post<ApiResponse<TicketResponse>>("ts/tickets/fare-matrix", {
      id: value,
    }),
  fareMatrixById: (value: number) =>
    http.get<ApiResponse<FareMatrixResponse>>(`ts/fare-matrices/${value}`),

  ticketById: (value: number) =>
    http.get<ApiResponse<TicketResponse>>(`ts/tickets/${value}`),
  generateQR: (value: string | undefined) =>
    http.get<ApiResponse>(`ts/tickets/generate-qr?ticketCode=${value}`),

  ticketByUser: () =>
    http.get<ApiResponse<OrderDetailResponse[]>>("orders/user/details"),
};

export default ticketsApiRequests;
