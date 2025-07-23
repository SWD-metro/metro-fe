import { apiFindAllHourUsageStatistics, apiFindAllStationUsageStatistics, apiFindAllTicketTypeStatistics } from "src/apis/stat.api";
import { HourUsageStatistic, StationUsageStatistic, TicketTypeStatistic } from "src/types/stat.type";
import { create } from "zustand";

type AdminState = {
  ticketTypeStatistics: TicketTypeStatistic[];
  stationUsageStatistic: StationUsageStatistic[];
  hourUsageStatistic: HourUsageStatistic[];

  isFetched: boolean;

  fetchAll: () => Promise<void>;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  ticketTypeStatistics: [],
  stationUsageStatistic: [],
  hourUsageStatistic: [],

  isFetched: false,

  fetchAll: async () => {
    if (get().isFetched) return;

    const [
      ticketTypeStatsRes,
      stationUsageStatsRes,
      hourUsageStatsRes
    ] = await Promise.all([
      apiFindAllTicketTypeStatistics(),
      apiFindAllStationUsageStatistics(),
      apiFindAllHourUsageStatistics()
    ]);

    const ticketTypeStatistics = ticketTypeStatsRes?.data || [];
    const stationUsageStatistic = stationUsageStatsRes?.data || [];
    const hourUsageStatistic = hourUsageStatsRes?.data || [];

    set({
      ticketTypeStatistics,
      stationUsageStatistic,
      hourUsageStatistic,
      isFetched: true
    });
  },
}));