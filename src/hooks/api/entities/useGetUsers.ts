import { User } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "../useApiGet";

export function useGetUsers(): ApiResult<User> {
  return useApiGet<User>('/api/users');
}
