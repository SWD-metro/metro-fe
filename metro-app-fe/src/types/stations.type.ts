export interface StationsRequest {
  routeId: number;
  stationCode: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
}

export interface StationUsageStatistic {
  id: number;
  stationId: number;
  stationName: string;
  usageDate: string;
  entryCount: number;
  exitCount: number;
  createdAt: string;
}

export interface HourUsageStatistic {
  id: number;
  usageDate: string;
  startHour: number;
  endHour: number;
  entryCount: number;
  exitCount: number;
  createdAt: string;
}

export interface StationsResponse {
  stationId: number;
  stationCode: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  routeId: number;
}

export interface Station {
  stationId: number;
  stationCode: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface StationRouteResponse {
  id: number;
  RouteId: number;
  sequenceOrder: number;
  stationsResponse: Station;
  status: Status;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Status = "active" | "decommissioned" | "maintenance";

export interface BusStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  isActive: number;
  address: string;
  code: string;
}

export interface BusStationDetail {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  isActive: number;
  address: string;
  code: string;
  routes: BusRoute[];
}

export interface BusRoute {
  id: string;
  name: string;
  distance: number;
  duration: number;
  start_time: string;
  end_time: string;
  is_active: number;
  route_num: string;
  direction: string;
  trip_spacing: string;
}
