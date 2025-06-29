import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApiRequests from "src/apis/user";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: userApiRequests.me,
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
