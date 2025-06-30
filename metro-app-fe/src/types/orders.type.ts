import { TicketResponse } from "./tickets.type";

export enum OrderStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

export interface TicketType {
  id: number;
}

export interface FareMatrix {
  id: number;
}

export interface OrderTicketDaysRequest {
  userId: number;
  ticketId: TicketType;
  paymentMethodId: number;
}

export interface OrderTicketSingleRequest {
  userId: number;
  fareMatrixId: FareMatrix;
  paymentMethodId: number;
}

export interface TransactionResponse {
  transactionId: number;
  userId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  transactionStatus: TransactionStatus;
  amount: number;
  createAt: string;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  ticketId: number;
  status: OrderStatus;
  amount: number;
  createdAt: string;
  transaction?: TransactionResponse;
}

export interface OrderDetailResponse {
  orderId: number;
  userId: number;
  status: OrderStatus;
  amount: number;
  ticket: TicketResponse;
}

export interface PaymentMethodResponse {
  paymentMethodId: number;
  paymentMethodName: string;
  active: boolean;
}

export interface PaymentResponse {
  amount: number;
  paymentUrl: string;
  transactionRef: string;
}

export interface PaymentCallbackResponse {
  status: "success" | "failed" | "invalid";
  message: string;
  transactionId?: string;
  amount?: number;
  responseCode?: string;
  transactionStatus?: string;
  ticketId?: number;
}
