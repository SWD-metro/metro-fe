import { StationsResponse } from "./stations.type";

export interface RoutesRequest {
  routeName: string;
  routeCode: string;
  distanceInKm: number;
}

export interface RoutesResponse {
  routeId: number;
  routeName: string;
  routeCode: string;
  distanceInKm: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteWithStations extends RoutesResponse {
  stations?: StationsResponse[];
}
