import { ApiResponse } from "src/types/api.type";
import { HourUsageStatistic, StationUsageStatistic, TicketTypeStatistic } from "src/types/stat.type";
import http from "src/utils/http";

export const apiFindAllTicketTypeStatistics = async (): Promise<ApiResponse<TicketTypeStatistic[]> | null> => {
  try {
    const res = await http.get("/stat/ticket-types");
    return res.data as ApiResponse<TicketTypeStatistic[]>;
  } catch {
    return null;
  }
}

export const apiFindAllStationUsageStatistics = async (): Promise<ApiResponse<StationUsageStatistic[]> | null> => {
  try {
    const res = await http.get("/stat/stations");
    return res.data as ApiResponse<StationUsageStatistic[]>;
  } catch {
    return null;
  }
}

export const apiFindAllHourUsageStatistics = async (): Promise<ApiResponse<HourUsageStatistic[]> | null> => {
  try {
    const res = await http.get("/stat/hours");
    return res.data as ApiResponse<HourUsageStatistic[]>;
  } catch {
    return null;
  }
}