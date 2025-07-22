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
