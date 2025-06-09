import { ResponseApi } from "src/types/api.type";
import { StationsResponse } from "src/types/stations.type";
import http from "src/utils/http";

const stationApiRequests = {
  stationList: () => http.get<ResponseApi<StationsResponse[]>>("/stations"),
};

export default stationApiRequests;
