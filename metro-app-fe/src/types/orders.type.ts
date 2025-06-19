export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export enum TicketStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  USED = "USED",
  CANCELLED = "CANCELLED",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
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

export interface TicketResponse {
  id: number;
  fareMatrixId: number;
  ticketTypeId: number;
  name: string;
  ticketCode: string;
  actualPrice: number;
  validFrom: string;
  validUntil: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  amount: number;
  paymentUrl: string;
  transactionRef: string;
}
