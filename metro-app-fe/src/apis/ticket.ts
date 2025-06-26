import { ApiResponse } from "src/types/api.type";
import { FareMatrixResponse } from "src/types/fares.type";
import { OrderDetailResponse } from "src/types/orders.type";
import { TicketResponse, TicketTypeResponse } from "src/types/tickets.type";
import http from "src/utils/http";

const ticketsApiRequests = {
  ticketTypeList: () =>
    http.get<ApiResponse<TicketTypeResponse[]>>("ts/ticket-types"),
  createTicketType: (value: number | undefined) =>
    http.post<ApiResponse<TicketResponse>>("ts/tickets/ticket-type", {
      id: value,
    }),
  ticketTypeById: (value: number) =>
    http.get<ApiResponse<TicketTypeResponse>>(`ts/ticket-types/${value}`),

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
