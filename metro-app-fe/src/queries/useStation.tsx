// src/queries/useStation.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import stationApiRequests from "src/apis/stations";

export const useGetStationList = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: stationApiRequests.stationList,
  });
};

export const useGetStationById = (stationId: number | undefined) => {
  return useQuery({
    queryKey: ["station", stationId],
    queryFn: () => stationApiRequests.getStationById(stationId!),
    enabled: !!stationId,
  });
};

export const useAddStationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stationApiRequests.addStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: (error) => {
      console.error("Error adding station:", error);
    },
  });
};

export const useUpdateStationMutation = () => {
  // const queryClient = useQueryClient();
  // return useMutation({
  //   mutationFn: ({ stationId, body }) => stationApiRequests.updateStation(stationId, body),
  //   onSuccess: (data, variables) => {
  //     queryClient.invalidateQueries({ queryKey: ["station", variables.stationId] });
  //     queryClient.invalidateQueries({ queryKey: ["stations"] });
  //     console.log(`Station ${variables.stationId} updated successfully!`);
  //   },
  //   onError: (error) => {
  //     console.error("Error updating station:", error);
  //   }
  // });
};

export const useDeleteStationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stationApiRequests.deleteStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      console.log("Station deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting station:", error);
    },
  });
};

export const useGetStationRoutesById = (routeId: number | undefined) => {
  return useQuery({
    queryKey: ["stations", routeId],
    queryFn: () => stationApiRequests.stationRoutesById(routeId!),
    enabled: !!routeId,
  });
};
