import { ApiResponse } from "src/types/api.type";
import { StationsResponse } from "src/types/stations.type";
import http from "src/utils/http";

const stationApiRequests = {
  stationList: () => http.get<ApiResponse<StationsResponse[]>>("stations"),
  addStation: (body: StationsResponse) =>
    http.post<ApiResponse<StationsResponse>>("stations", body),
};

export default stationApiRequests;
