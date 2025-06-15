import { ApiResponse } from "src/types/api.type";
import { SchedulesRequest, SchedulesResponse } from "src/types/schedules.type";
import http from "src/utils/http";

const schedulesApiRequests = {
  schedulesList: () => http.get<ApiResponse<SchedulesResponse[]>>("schedules"),
  addSchedule: (body: SchedulesRequest) =>
    http.post<ApiResponse<SchedulesResponse>>("schedules", body),
  getScheduleByStationId: (id: number) =>
    http.get<ApiResponse<SchedulesResponse[]>>(`schedules/station/${id}`),
  updateSchedule: (id: number, body: SchedulesRequest) =>
    http.put<ApiResponse<SchedulesResponse>>(`schedules/${id}`, body),
  deleteSchedule: (id: number) =>
    http.delete<ApiResponse<SchedulesResponse>>(`schedules/${id}`),
};

export default schedulesApiRequests;
