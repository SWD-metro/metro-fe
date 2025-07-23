import http from "src/utils/http";
import type { ApiResponse } from "../types/api.type";
import { RoutesRequest, RoutesResponse } from "src/types/routes.type";

export const API_PATH = {
  ROUTE: "http://localhost:4003/api/routes",
} as const;

export const apiGetRoutes = async (): Promise<ApiResponse<RoutesResponse[]> | null> => {
  try {
    const res = await http.get(API_PATH.ROUTE);
    return res.data as ApiResponse<RoutesResponse[]>;
  } catch {
    return null;
  }
}

export const apiGetRoute = async (id: string): Promise<ApiResponse<RoutesResponse> | null> => {
  try {
    const res = await http.get(`${API_PATH.ROUTE}/${id}`);
    return res.data as ApiResponse<RoutesResponse>;
  } catch {
    return null;
  }
}

export const apiSearchRoute = async (name: string): Promise<ApiResponse<RoutesResponse[]> | null> => {
  try {
    const res = await http.get(`${API_PATH.ROUTE}/search`, {
      params: {
        name,
      }
    });
    return res.data as ApiResponse<RoutesResponse[]>;
  } catch {
    return null;
  }
}

export const apiGetRouteByCode = async (routeCode: string): Promise<ApiResponse<RoutesResponse> | null> => {
  try {
    const res = await http.get(`${API_PATH.ROUTE}/code/${routeCode}`
    );
    return res.data as ApiResponse<RoutesResponse>;
  } catch {
    return null;
  }
}

export const apiCreateRoute = async (route: RoutesRequest): Promise<ApiResponse<RoutesResponse> | null> => {
  try {
    const res = await http.post(API_PATH.ROUTE, route);
    return res.data as ApiResponse<RoutesResponse>;
  } catch {
    return null;
  }
}

export const apiUpdateRoute = async (route: RoutesRequest, id: number): Promise<ApiResponse<RoutesResponse> | null> => {
  try {
    const res = await http.put(`${API_PATH.ROUTE}/${id}`, route);
    return res.data as ApiResponse<RoutesResponse>;
  } catch {
    return null;
  }
}

export const apiDeleteRoute = async (id: number): Promise<ApiResponse<RoutesResponse> | null> => {
  try {
    const res = await http.delete(`${API_PATH.ROUTE}/${id}`);
    return res.data as ApiResponse<RoutesResponse>;
  } catch {
    return null;
  }
}