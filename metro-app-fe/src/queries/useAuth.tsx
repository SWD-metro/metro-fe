import { useMutation } from "@tanstack/react-query";
import authApiRequests from "src/apis/auth";

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
