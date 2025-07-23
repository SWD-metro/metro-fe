import http from "src/utils/http";
import type { ApiResponse } from "../types/api.type";
import type { FareMatrixRequest, FareMatrix, FindFareRequest, FarePricingRequest, FarePricing } from "../types/fare.type";

const API_PATH = {
  FARE: "http://localhost:4003/api/ts/fare-matrices",
  FARE_PRICING: "http://localhost:4003/api/ts/fare-pricing",
} as const;


export const apiGetFareMatrices = async (): Promise<ApiResponse<FareMatrix[]> | null> => {
	try {
		const res = await http.get(API_PATH.FARE);
		return res.data as ApiResponse<FareMatrix[]>;
	} catch {
		return null;
	}
}

export const apiCreateFareMatrix = async (fareMatrix: FareMatrixRequest): Promise<ApiResponse<FareMatrix> | null> => {
	try {
		const res = await http.post(`${API_PATH.FARE}/create`, fareMatrix);
		return res.data as ApiResponse<FareMatrix>;
	} catch {
		return null;
	}
}

export const apiUpdateFareMatrix = async (fareMatrix: FareMatrixRequest, fareMatrixId: number): Promise<ApiResponse<FareMatrix> | null> => {
	try {
		const res = await http.put(`${API_PATH.FARE}/update/${fareMatrixId}`, fareMatrix);
		return res.data as ApiResponse<FareMatrix>;
	} catch {
		return null;
	}
}

export const apiDeleteFareMatrix = async (fareMatrixId: number): Promise<ApiResponse<FareMatrix> | null> => {
	try {
		const res = await http.delete(`${API_PATH.FARE}/delete/${fareMatrixId}`);
		return res.data as ApiResponse<FareMatrix>;
	} catch {
		return null;
	}
}

export const apiFindFareMatrix = async (fareMatrix: FindFareRequest): Promise<ApiResponse<FareMatrix> | null> => {
	try {
		const res = await http.post(`${API_PATH.FARE}/get-fare`, fareMatrix);
		return res.data as ApiResponse<FareMatrix>;
	} catch {
		return null;
	}
}

export const apiGetFareMatricesByStation = async (stationId: number): Promise<ApiResponse<FareMatrix[]> | null> => {
	try {
		const res = await http.get(`${API_PATH.FARE}/by-station/${stationId}`);
		return res.data as ApiResponse<FareMatrix[]>;
	} catch {
		return null;
	}
}

export const apiGetFareMatrix = async (id: number): Promise<ApiResponse<FareMatrix> | null> => {
	try {
		const res = await http.get(`${API_PATH.FARE}/${id}`);
		return res.data as ApiResponse<FareMatrix>;
	} catch {
		return null;
	}
}

export const apiUpdateStatusFareMatrix = async (id: number, status: boolean): Promise<ApiResponse<FareMatrix> | null> => {
	try {
		const res = await http.put(`${API_PATH.FARE}/update-status/${id}?status=${status}`);
		return res.data as ApiResponse<FareMatrix>;
	} catch {
		return null
	}
}

export const apiFindAllFarePricing = async (): Promise<ApiResponse<FarePricing[]> | null> => {
	try {
		const res = await http.get(`${API_PATH.FARE_PRICING}`);
		return res.data as ApiResponse<FarePricing[]>;
	} catch {
		return null;
	}
}

export const apiCreateFarePricing = async (data: FarePricingRequest): Promise<ApiResponse<FarePricing> | null> => {
	try {
		const res = await http.post(`${API_PATH.FARE_PRICING}`, data);
		return res.data as ApiResponse<FarePricing>;
	} catch {
		return null;
	}
};

export const apiUpdateFarePricing = async (data: FarePricingRequest, id: number): Promise<ApiResponse<FarePricing> | null> => {
	try {
		const res = await http.put(`${API_PATH.FARE_PRICING}/${id}`, data);
		return res.data as ApiResponse<FarePricing>;
	} catch	 {
		return null;
	}
};