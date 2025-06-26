import { ApiResponse } from "src/types/api.type";
import { StationsResponse, StationsRequest } from "src/types/stations.type";
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
};

export default stationApiRequests;