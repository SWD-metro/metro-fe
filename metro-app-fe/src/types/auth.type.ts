import { AuthProvider } from "./user.type";

export interface LocalLoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface SocialLoginRequest {
  email: string;
  name: string;
  providerId: string;
  pictureUrl: string;
  authProvider: AuthProvider;
}
export interface EmailRequest {
  to: string;
  subject: string;
  content: string;
}

export interface OtpRequest {
  email: string;
  purpose: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: string;
}
