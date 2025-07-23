import { useQuery } from '@tanstack/react-query';
import cronjobApiRequests from 'src/apis/cronjob';
import { HourUsageStatistic, StationUsageStatistic } from 'src/types/stations.type';
import { TicketTypeStatistic } from 'src/types/tickets.type';
import { ApiResponse } from 'src/types/api.type';

export const useFindAllHourUsageStatistics = () => {
  return useQuery<ApiResponse<HourUsageStatistic[]>, Error>({
    queryKey: ['hourUsageStatistics'], 
    queryFn: async () => {
      const response = await cronjobApiRequests.findAllHourUsageStatistics();
      // React Query mong đợi một Promise resolve với data hoặc reject với Error
      if (response.data && response.data.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data?.message || "Failed to fetch hourly statistics.");
      }
    },
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false, 
  });
};

export const useFindAllStationUsageStatistics = () => {
  return useQuery<ApiResponse<StationUsageStatistic[]>, Error>({
    queryKey: ['stationUsageStatistics'],
    queryFn: async () => {
      const response = await cronjobApiRequests.findAllStationUsageStatistics();
      if (response.data && response.data.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data?.message || "Failed to fetch station statistics.");
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};


export const useFindAllTicketTypeStatistics = () => {
  return useQuery<ApiResponse<TicketTypeStatistic[]>, Error>({
    queryKey: ['ticketTypeStatistics'], 
    queryFn: async () => {
      const response = await cronjobApiRequests.findAllTicketTypeStatistics();
      if (response.data && response.data.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data?.message || "Failed to fetch ticket type statistics.");
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
