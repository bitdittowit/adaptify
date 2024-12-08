import { User } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "@/hooks/api/useApiGet";

export function useGetUsers(): ApiResult<User> {
  return useApiGet<User>('/api/users');
}
