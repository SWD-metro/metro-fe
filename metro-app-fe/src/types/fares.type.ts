export interface FareMatrixRequest {
  fareMatrixId?: number;
  price: number;
  startStationId: number;
  endStationId: number;
  name: string;
}

export interface FareMatrixResponse {
  fareMatrixId: number;
  name: string;
  price: number;
  startStationId: number;
  endStationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FareMatrixStationRequest {
  stationId: number;
}

export interface FareMatrixUpdateRequest {
  fareMatrixId: number;
  price: number;
  name: string;
  isActive: boolean;
}

export interface FareRequest {
  startStationId: number;
  endStationId: number;
}
