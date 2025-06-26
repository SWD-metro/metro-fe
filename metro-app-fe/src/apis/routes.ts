import { ApiResponse } from "src/types/api.type";
import { RoutesResponse } from "src/types/routes.type";
import http from "src/utils/http";

const routesApiRequests = {
  routeList: () => http.get<ApiResponse<RoutesResponse[]>>("routes"),

  addRoute: (body: RoutesResponse) =>
    http.post<ApiResponse<RoutesResponse>>("routes", body),

  getRouteById: (routeId: number) =>
    http.get<ApiResponse<RoutesResponse>>(`routes/${routeId}`),

  updateRoute: (routeId: number, body: RoutesResponse) =>
    http.put<ApiResponse<RoutesResponse>>(`routes/${routeId}`, body), 

  deleteRoute: (routeId: number) =>
    http.delete<ApiResponse<void>>(`routes/${routeId}`),
};

export default routesApiRequests;
