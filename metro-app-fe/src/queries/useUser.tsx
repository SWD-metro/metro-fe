import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApiRequests from "src/apis/user";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: userApiRequests.me,
  });
};

export const useGetUserByUserId = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userApiRequests.userByUserId(id),
    enabled,
  });
};

export const useGetRequestListByUser = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["requests", id],
    queryFn: () => userApiRequests.requestListByUser(id),
    enabled,
  });
};

export const useCreateStudentRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequests.request,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useGetRequestsList = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: userApiRequests.requestList,
  });
};

export const useVerifyRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequests.verifyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useCreateFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequests.createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};

export const useGetFeedbackListByUser = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["feedbacks", id],
    queryFn: () => userApiRequests.feedbackListByUser(id),
    enabled,
  });
};

export const useGetFeedbacksList = () => {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: userApiRequests.feedbackList,
  });
};
