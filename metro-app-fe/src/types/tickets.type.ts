import { FareMatrixResponse } from "./fares.type";

export enum TicketStatus {
  USED = "USED",
  NOT_USED = "NOT_USED",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

export interface TicketTypeStatistic {
  id: number;
  ticketType: string;
  usageDate: string;
  usageCount: number;
  createdAt: string;
}

export interface TicketQrData {
  ticketId: number;
  ticketTypeName: string;
  name: string;
  validFrom: string;
  validUntil: string;
  ticketCode: string;
  actualPrice: number;
  signature: string;
}

export interface TicketRequest {
  fareMatrixId: number;
  ticketTypeId: number;
}

export interface TicketResponse {
  id: number;
  fareMatrixId: number;
  ticketTypeId: number;
  name: string;
  ticketCode: string;
  qrCodeData: string;
  actualPrice: number;
  validFrom: string;
  validUntil: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketScanRequest {
  stationId: number;
  qrCodeData: Uint8Array;
}

export interface TicketStatusRequest {
  status: TicketStatus;
}

export interface TicketTypeRequest {
  ticketTypeId?: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  validityDuration: number;
}

export interface TicketTypeResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  validityDuration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  forStudent: boolean;
}

export interface UpdateTicketTypeRequest {
  ticketTypeId: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  validityDuration: number;
}

export enum UsageTypes {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
  VALIDATION = "VALIDATION",
}

export interface TicketUsageLogRequest {
  qrCodeData: string;
  stationId: number;
  usageType: UsageTypes;
}

export interface TicketUsageLogResponse {
  ticketUsageLogId: number;
  ticketCode: string;
  usageTime: string;
  stationId: number;
  usageType: UsageTypes;
}

export interface TicketWithDetails extends TicketResponse {
  fareMatrix?: FareMatrixResponse;
  ticketType?: TicketTypeResponse;
  usageLogs?: TicketUsageLogResponse[];
}
