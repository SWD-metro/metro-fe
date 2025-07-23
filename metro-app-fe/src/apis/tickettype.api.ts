import http from "src/utils/http";
import type { ApiResponse } from "../types/api.type";
import type { TicketType, TicketTypeRequest } from "../types/tickettype.type";

const API_PATH = {
  TICKETTYPE: "http://localhost:4003/api/ts/ticket-types",
} as const;

export const apiGetTicketTypes = async (): Promise<ApiResponse<TicketType[]> | null> => {
	try {
		const res = await http.get(API_PATH.TICKETTYPE);
		return res.data as ApiResponse<TicketType[]>;
	} catch {
		return null;
	}
}

export const apiGetTicketTypeById = async (ticketTypeId: number): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await http.get(`${API_PATH.TICKETTYPE}/${ticketTypeId}`);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}

export const apiUpdateTicketType = async (ticketType: TicketTypeRequest, id: number): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await http.put(`${API_PATH.TICKETTYPE}/update/${id}`, ticketType);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}

export const apiDeleteTicketType = async (id: number): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await http.delete(`${API_PATH.TICKETTYPE}/delete/${id}`);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}

export const apiCreateTicketType = async (ticketType: TicketTypeRequest): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await http.post(`${API_PATH.TICKETTYPE}/create`, ticketType);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}
