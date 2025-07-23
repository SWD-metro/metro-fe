import { ApiResponse } from "src/types/api.type";
import { FareMatrixRequest, FareMatrixResponse } from "src/types/fares.type";
import { OrderDetailResponse } from "src/types/orders.type";
import { StationRouteResponse } from "src/types/stations.type";
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
    http.post<ApiResponse<TicketTypeResponse>>("ts/ticket-types/create", data),

  ticketTypeById: (value: number) =>
    http.get<ApiResponse<TicketTypeResponse>>(`ts/ticket-types/${value}`),

  updateTicketType: (
    id: number,
    data: Omit<TicketTypeResponse, "id" | "createdAt" | "updatedAt">
  ) => http.put<ApiResponse<TicketTypeResponse>>(`ts/ticket-types/${id}`, data),

  deleteTicketType: (id: number) =>
    http.delete<ApiResponse>(`ts/ticket-types/delete/${id}`),

  fareMatricesList: () =>
    http.get<ApiResponse<FareMatrixResponse[]>>("ts/fare-matrices"),
  createTicketFareMatrix: (data: FareMatrixRequest) =>
    http.post<ApiResponse<TicketResponse>>("ts/fare-matrices/create", data),
  deleteTicketFareMatrix: (id: number) =>
    http.delete<ApiResponse>(`ts/fare-matrices/delete/${id}`),

  fareMatrixById: (value: number) =>
    http.get<ApiResponse<FareMatrixResponse>>(`ts/fare-matrices/${value}`),

  ticketById: (value: number) =>
    http.get<ApiResponse<TicketResponse>>(`ts/tickets/${value}`),
  generateQR: (value: string | undefined) =>
    http.get<ApiResponse>(`ts/tickets/generate-qr?ticketCode=${value}`),

  ticketByUser: () =>
    http.get<ApiResponse<OrderDetailResponse[]>>("orders/user/details"),

  getStationsForUpdate: (ticketId: number) =>
    http.get<ApiResponse<StationRouteResponse[]>>(`ts/tickets/stations/upgrade/${ticketId}`),

  getUpgradeAmount: (ticketId: number, endStationId: number) =>
    http.get<ApiResponse<number>>(`ts/tickets/amount/${ticketId}/${endStationId}`),
};

export default ticketsApiRequests;
