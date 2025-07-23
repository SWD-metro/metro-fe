import { ApiResponse } from "src/types/api.type";
import { BusStation, BusStationDetail } from "src/types/stations.type";

import http from "src/utils/http";

const busApiRequests = {
  busList: () => http.get<ApiResponse<BusStation[]>>("bus"),

  busByStationId: (stationId: number) =>
    http.get<ApiResponse<BusStationDetail[]>>(`bus/routes/${stationId}`),
};

export default busApiRequests;
