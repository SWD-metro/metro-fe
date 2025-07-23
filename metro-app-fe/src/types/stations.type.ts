export interface StationsRequest {
  stationCode: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
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

export interface StationRouteRequest {
    routeId: number,
    stationId: number,
    sequenceOrder: number,
}

export type Status = "active" | "decommissioned" | "maintenance";
