import { Station, StationsRequest, Status } from "src/types/stations.type";
import type { ApiResponse } from "../types/api.type";
import http from "src/utils/http";

const API_PATH = {
  STATIONS: "http://localhost:4003/api/stations",
} as const;

export const apiGetStations = async (): Promise<ApiResponse<
  Station[]
> | null> => {
  try {
    const res = await http.get(API_PATH.STATIONS);
    return res.data as ApiResponse<Station[]>;
  } catch {
    return null;
  }
};

export const apiCreateStation = async (
  station: StationsRequest
): Promise<ApiResponse<Station> | null> => {
  try {
    const res = await http.post(API_PATH.STATIONS, station);
    return res.data as ApiResponse<Station>;
  } catch {
    return null;
  }
};

export const apiGetStationByName = async (
  stationName: string
): Promise<ApiResponse<Station[]> | null> => {
  try {
    const res = await http.get(
      `${API_PATH.STATIONS}/search?name=${stationName}`
    );
    return res.data as ApiResponse<Station[]>;
  } catch {
    return null;
  }
};

export const apiUpdateStation = async (
  station: StationsRequest,
  id: number
): Promise<ApiResponse<Station> | null> => {
  try {
    const res = await http.put(`${API_PATH.STATIONS}/${id}`, station);
    return res.data as ApiResponse<Station>;
  } catch {
    return null;
  }
};

export const apiDeleteStation = async (
  id: number
): Promise<ApiResponse<Station> | null> => {
  try {
    const res = await http.delete(`${API_PATH.STATIONS}/${id}`);
    return res.data as ApiResponse<Station>;
  } catch {
    return null;
  }
};
export const apiUpdateStationStatus = async (
  id: number,
  status: Status
): Promise<ApiResponse<Station> | null> => {
  try {
    const res = await http.post(
      `${API_PATH.STATIONS}/status/${id}?status=${status}`
    );
    return res.data as ApiResponse<Station>;
  } catch {
    return null;
  }
};
