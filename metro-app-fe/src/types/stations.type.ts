export interface StationsRequest {
  routeId: number;
  stationCode: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
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
