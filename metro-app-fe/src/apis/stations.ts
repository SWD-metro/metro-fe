import { ApiResponse } from "src/types/api.type";
import {
  StationsResponse,
  StationsRequest,
  StationRouteResponse,
} from "src/types/stations.type";
import http from "src/utils/http";

const stationApiRequests = {
  stationList: () => http.get<ApiResponse<StationsResponse[]>>("stations"),

  addStation: (body: StationsRequest) =>
    http.post<ApiResponse<StationsResponse>>("stations", body),

  getStationById: (stationId: number) =>
    http.get<ApiResponse<StationsResponse>>(`stations/${stationId}`),

  updateStation: (stationId: number, body: StationsRequest) =>
    http.put<ApiResponse<StationsResponse>>(`stations/${stationId}`, body),

  deleteStation: (stationId: number) =>
    http.delete<ApiResponse<void>>(`stations/${stationId}`),

  updateStationStatus: (stationId: number, status: string) =>
    http.post<ApiResponse<StationsResponse>>(`stations/status/${stationId}?status=${status}`),

  stationRoutesById: (routeId: number) =>
    http.get<ApiResponse<StationRouteResponse[]>>(
      `station-routes/route/${routeId}`
    ),
};

export default stationApiRequests;
