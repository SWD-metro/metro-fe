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
