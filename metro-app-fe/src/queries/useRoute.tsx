import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import routesApiRequests from "src/apis/routes";

export const useGetRouteList = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: routesApiRequests.routeList,
  });
};

export const useGetRouteById = (routeId: number | undefined) => {
  return useQuery({
    queryKey: ["route", routeId],
    queryFn: () => routesApiRequests.getRouteById(routeId!),
    enabled: !!routeId,
  });
};

export const  useAddRouteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: routesApiRequests.addRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      console.log("Route added successfully!");
    },
    onError: (error) => {
      console.error("Error adding route:", error);
    }
  })
}

export const useUpdateRouteMutation = () => {}

export const useDeleteRouteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: routesApiRequests.deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      console.log("Route deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting route:", error);
    }
  });
}