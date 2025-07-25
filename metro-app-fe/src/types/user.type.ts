// Enums
export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface VerifyRequestParams {
  requestId: number;
  isApproved: boolean;
  rejectionReason: string;
}

export interface BlogRequest {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  comments: number;
  image: string;
  content: string;
  tags: string[];
  readTime: string;
  excerpt: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  collectionId: string;
  collectionName: string;
}

export interface BlogResponse {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  comments: number;
  image: string;
  content: string;
  tags: string[];
  readTime: string;
  excerpt: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPageResponse {
  items: BlogRequest[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface FeedbackCreationRequest {
  category: string;
  content: string;
  image?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  name: string;
  password: string;
  authProvider: AuthProvider;
}

export interface RequestCreationRequest {
  content: string;
  citizenIdNumber: string;
  studentCardImage: string;
  citizenIdentityCardImage: string;
  endDate: string;
}

export interface Feedback {
  feedbackId: number;
  category: string;
  content: string;
  image?: string;
  reply?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RequestDto {
  requestId: number;
  content?: string;
  studentCardImage: string;
  citizenIdentityCardImage: string;
  requestStatus: RequestStatus;
  rejectionReason: string;
  startDate?: string;
  endDate?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  name?: string;
  role: string;
  authProvider: AuthProvider;
  pictureUrl?: string;
  isStudent: boolean;
  studentExpiredDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackReply {
  feedbackId: number;
  content: string;
}
