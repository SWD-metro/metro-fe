import { useQuery } from "@tanstack/react-query";
import busApiRequests from "src/apis/bus";

export const useGetBusList = () => {
  return useQuery({
    queryKey: ["bus"],
    queryFn: busApiRequests.busList,
  });
};

export const useGetBusByStationId = (stationId: number | undefined) => {
  return useQuery({
    queryKey: ["bus", stationId],
    queryFn: () => busApiRequests.busByStationId(stationId!),
    enabled: !!stationId,
  });
};
