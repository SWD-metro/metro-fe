import { ApiResponse } from "src/types/api.type";
import { RoutesResponse } from "src/types/routes.type";
import http from "src/utils/http";

const routesApiRequests = {
  routeList: () => http.get<ApiResponse<RoutesResponse[]>>("routes"),
};

export default routesApiRequests;
