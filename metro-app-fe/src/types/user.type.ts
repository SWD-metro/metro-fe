export enum AuthProvider {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  LOCAL = "LOCAL",
}

export interface User {
  userId: number;
  email: string;
  name?: string;
  role?: string;
  authProvider: AuthProvider;
  pictureUrl?: string;
  googleId?: string;
  isStudent: boolean;
  studentExpiredDate?: string;
  createdAt: string;
  updatedAt: string;
}
