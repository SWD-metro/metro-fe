import { useQuery } from "@tanstack/react-query";
import stationApiRequests from "src/apis/stations";

export const useGetStationList = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: stationApiRequests.stationList,
  });
};
