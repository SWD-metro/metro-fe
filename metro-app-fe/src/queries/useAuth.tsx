import { useMutation, useQuery } from "@tanstack/react-query";
import authApiRequests from "src/apis/auth";
import { OtpRequest, VerifyOtpRequest } from "src/types/auth.type";
import { RegisterRequest } from "src/types/user.type";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequests.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequests.logout,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (body: RegisterRequest) => authApiRequests.register(body),
  });
};

export const useCheckEmail = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["checkEmail", email],
    queryFn: () => authApiRequests.checkEmail(email),
    enabled: !!email && enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCheckUserName = (username: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["checkUserName", username],
    queryFn: () => authApiRequests.checkUserName(username),
    enabled: !!username && enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSendOtpMutation = () =>
  useMutation({
    mutationFn: (body: OtpRequest) => authApiRequests.sendOtp(body),
  });

export const useVerifyOtpMutation = () =>
  useMutation({
    mutationFn: (body: VerifyOtpRequest) => authApiRequests.verifyOtp(body),
  });
