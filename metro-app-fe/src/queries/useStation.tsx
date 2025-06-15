import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import stationApiRequests from "src/apis/stations";

export const useGetStationList = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: stationApiRequests.stationList,
  });
};

export const useAddStationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stationApiRequests.addStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
  });
};
