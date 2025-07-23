import { ApiResponse } from "src/types/api.type";
import {
  StationRouteResponse,
  StationRouteRequest,
  Status,
} from "src/types/stations.type";
import http from "src/utils/http";

const stationRouteApiRequests = {
  getStationRoutesByRouteId: (routeId: number) =>
    http.get<ApiResponse<StationRouteResponse[]>>(
      `station-routes/route/${routeId}`
    ),

  getStationRouteById: (id: number) =>
    http.get<ApiResponse<StationRouteResponse>>(`station-routes/${id}`),

  addStationRoute: (body: StationRouteRequest) =>
    http.post<ApiResponse<StationRouteResponse>>("station-routes", body),

  updateStationRoute: (id: number, body: StationRouteRequest) =>
    http.put<ApiResponse<StationRouteResponse>>(`station-routes/${id}`, body),

  deleteStationRoute: (id: number) =>
    http.delete<ApiResponse<void>>(`station-routes/${id}`),

  reorderStationRouteAfterDelete: (routeId: number) =>
    http.put<ApiResponse<void>>(`station-routes/reorder/route/${routeId}`),

  updateStationRouteStatus: (id: number, status: Status) =>
    http.put<ApiResponse<void>>(`station-routes/${id}/status`, null, {
      params: { status },
    }),
};

export default stationRouteApiRequests;


