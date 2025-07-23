import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import stationRouteApiRequests from "src/apis/stationeroute.api";
import type { StationRouteRequest, Status } from "src/types/stations.type";

// Query keys
export const stationRouteKeys = {
  all: ['station-routes'] as const,
  byRouteId: (routeId: number) => [...stationRouteKeys.all, 'route', routeId] as const,
  byId: (id: number) => [...stationRouteKeys.all, 'detail', id] as const,
};

// Get station routes by route ID
export const useGetStationRoutesByRouteId = (routeId: number) => {
  return useQuery({
    queryKey: stationRouteKeys.byRouteId(routeId),
    queryFn: async () => {
      const response = await stationRouteApiRequests.getStationRoutesByRouteId(routeId);
      return response.data.data || [];
    },
    enabled: !!routeId,
  });
};

// Get station route by ID
export const useGetStationRouteById = (id: number) => {
  return useQuery({
    queryKey: stationRouteKeys.byId(id),
    queryFn: async () => {
      const response = await stationRouteApiRequests.getStationRouteById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create station route mutation
export const useCreateStationRouteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stationRoute: StationRouteRequest) => {
      const response = await stationRouteApiRequests.addStationRoute(stationRoute);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.status === 200 || data?.status === 201) {
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.all });
        toast.success("Tạo station route thành công!");
      } else {
        toast.error(data?.message || "Tạo station route thất bại!");
      }
    },
    onError: (error) => {
      console.error("Create station route error:", error);
      toast.error("Có lỗi xảy ra khi tạo station route!");
    },
  });
};

// Update station route mutation
export const useUpdateStationRouteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stationRoute }: { id: number; stationRoute: StationRouteRequest }) => {
      const response = await stationRouteApiRequests.updateStationRoute(id, stationRoute);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data?.status === 200 || data?.status === 201) {
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.all });
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.byId(variables.id) });
        toast.success("Cập nhật station route thành công!");
      } else {
        toast.error(data?.message || "Cập nhật station route thất bại!");
      }
    },
    onError: (error) => {
      console.error("Update station route error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật station route!");
    },
  });
};

// Delete station route mutation
export const useDeleteStationRouteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await stationRouteApiRequests.deleteStationRoute(id);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.status === 200 || data?.status === 204) {
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.all });
        toast.success("Xóa station route thành công!");
      } else {
        toast.error(data?.message || "Xóa station route thất bại!");
      }
    },
    onError: (error) => {
      console.error("Delete station route error:", error);
      toast.error("Có lỗi xảy ra khi xóa station route!");
    },
  });
};

// Reorder station routes after deletion mutation
export const useReorderStationRouteAfterDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeId: number) => {
      const response = await stationRouteApiRequests.reorderStationRouteAfterDelete(routeId);
      return response.data;
    },
    onSuccess: (data, routeId) => {
      if (data?.status === 200 || data?.status === 204) {
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.byRouteId(routeId) });
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.all });
        toast.success("Sắp xếp lại station routes thành công!");
      } else {
        toast.error(data?.message || "Sắp xếp lại station routes thất bại!");
      }
    },
    onError: (error) => {
      console.error("Reorder station routes error:", error);
      toast.error("Có lỗi xảy ra khi sắp xếp lại station routes!");
    },
  });
};

// Update station route status mutation
export const useUpdateStationRouteStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: Status }) => {
      const response = await stationRouteApiRequests.updateStationRouteStatus(id, status);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data?.status === 200 || data?.status === 204) {
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.all });
        queryClient.invalidateQueries({ queryKey: stationRouteKeys.byId(variables.id) });
        toast.success("Cập nhật trạng thái ga thành công!");
      } else {
        toast.error(data?.message || "Cập nhật trạng thái ga thất bại!");
      }
    },
    onError: (error) => {
      console.error("Update station route status error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái ga!");
    },
  });
};