import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import schedulesApiRequests from "src/apis/schedules";
import { SchedulesRequest } from "src/types/schedules.type";

export const useGetScheduleList = () => {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: schedulesApiRequests.schedulesList,
  });
};

export const useAddScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: schedulesApiRequests.addSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & SchedulesRequest) => {
      return schedulesApiRequests.updateSchedule(id, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"], exact: true });
    },
  });
};

export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: schedulesApiRequests.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useGetScheduleByStationId = (stationId: number | undefined) => {
  return useQuery({
    queryKey: ["schedules", stationId],
    queryFn: () => schedulesApiRequests.getScheduleByStationId(stationId!),
    enabled: !!stationId,
  });
};
