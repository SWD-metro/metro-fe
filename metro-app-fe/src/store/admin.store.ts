import { apiFindAllFarePricing, apiGetFareMatrices } from "src/apis/fare.api";
import { apiFindAllHourUsageStatistics, apiFindAllStationUsageStatistics, apiFindAllTicketTypeStatistics } from "src/apis/stat.api";
import { apiGetTicketTypes } from "src/apis/tickettype.api";
import { FareMatrix, FarePricing } from "src/types/fare.type";
import { HourUsageStatistic, StationUsageStatistic, TicketTypeStatistic } from "src/types/stat.type";
import { TicketType } from "src/types/tickettype.type";
import { create } from "zustand";

type AdminState = {
  ticketTypes: TicketType[];
  fareMatrices: FareMatrix[];
  farePricings: FarePricing[];

  ticketTypeStatistics: TicketTypeStatistic[];
  stationUsageStatistic: StationUsageStatistic[];
  hourUsageStatistic: HourUsageStatistic[];

  isFetched: boolean;

  fetchAll: () => Promise<void>;

  setTicketTypes: (data: TicketType[]) => void;
  setFareMatrices: (data: FareMatrix[]) => void;
  setFarePricings: (farePricings: FarePricing[]) => void;

  updateTicketType: (data: TicketType) => void;
  updateFareMatrix: (data: FareMatrix) => void;
  updateFarePricing: (farePricing: FarePricing) => void;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  ticketTypes: [],
  fareMatrices: [],
  farePricings: [],

  ticketTypeStatistics: [],
  stationUsageStatistic: [],
  hourUsageStatistic: [],

  isFetched: false,

  fetchAll: async () => {
    if (get().isFetched) return;

    const [
      ticketTypesRes,
      fareMatricesRes,
      farePricingsRes,
      ticketTypeStatsRes,
      stationUsageStatsRes,
      hourUsageStatsRes
    ] = await Promise.all([
      apiGetTicketTypes(),
      apiGetFareMatrices(),
      apiFindAllFarePricing(),
      apiFindAllTicketTypeStatistics(),
      apiFindAllStationUsageStatistics(),
      apiFindAllHourUsageStatistics()
    ]);

    const ticketTypes = ticketTypesRes?.data || [];
    const fareMatrices = fareMatricesRes?.data || [];
    const farePricings = farePricingsRes?.data || [];

    const ticketTypeStatistics = ticketTypeStatsRes?.data || [];
    const stationUsageStatistic = stationUsageStatsRes?.data || [];
    const hourUsageStatistic = hourUsageStatsRes?.data || [];

    set({
      ticketTypes,
      fareMatrices,
      farePricings,
      ticketTypeStatistics,
      stationUsageStatistic,
      hourUsageStatistic,
      isFetched: true
    });
  },

  setTicketTypes: (data) => set({ ticketTypes: data }),
  setFareMatrices: (data) => set({ fareMatrices: data }),
  setFarePricings: (farePricings) => set({ farePricings }),

  updateTicketType: (updated: TicketType) =>
    set((state) => ({
      ticketTypes: state.ticketTypes.map((t) =>
        t.id === updated.id ? updated : t
      )
    })),

  updateFareMatrix: (updated: FareMatrix) =>
    set((state) => ({
      fareMatrices: state.fareMatrices.map((f) =>
        f.fareMatrixId === updated.fareMatrixId ? updated : f
      )
    })),

  updateFarePricing: (updatedFarePricing) =>
    set((state) => ({
      farePricings: state.farePricings.map((pricing) =>
        pricing.id === updatedFarePricing.id ? updatedFarePricing : pricing
      ),
    }))
}));