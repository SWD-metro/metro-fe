import { ApiResponse } from "src/types/api.type";
import { HourUsageStatistic, StationUsageStatistic } from "src/types/stations.type";
import { TicketTypeStatistic } from "src/types/tickets.type";
import http from "src/utils/http";

const cronjobApiRequests = {
  findAllTicketTypeStatistics: () =>
    http.get<ApiResponse<TicketTypeStatistic[]>>("stat/ticket-types"),
 findAllStationUsageStatistics: () =>
    http.get<ApiResponse<StationUsageStatistic[]>>("stat/stations"),
  findAllHourUsageStatistics: () =>
    http.get<ApiResponse<HourUsageStatistic[]>>("stat/hours"),
};

export default cronjobApiRequests;