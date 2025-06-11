import { useQuery } from "@tanstack/react-query";
import routesApiRequests from "src/apis/routes";

export const useGetRouteList = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: routesApiRequests.routeList,
  });
};
