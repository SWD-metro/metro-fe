export enum Direction {
  INBOUND = "INBOUND",
  OUTBOUND = "OUTBOUND",
}

export interface SchedulesRequest {
  stationId: number;
  timeArrival: string;
  timeDeparture: string;
  direction: Direction;
}

export interface SchedulesResponse {
  scheduleId: number;
  description: string;
  timeArrival: string;
  timeDeparture: string;
  direction: string;
  createdAt: string;
  updatedAt: string;
  stationId: number;
  stationName: string;
}
