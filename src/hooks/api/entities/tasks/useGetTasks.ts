import { UserTask } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "../../useApiGet";

export function useGetTasks(): ApiResult<UserTask[]> {
  return useApiGet<UserTask[]>('/api/tasks');
}
