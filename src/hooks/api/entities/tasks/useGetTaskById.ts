import { UserTask } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "@/hooks/api/useApiGet";

export function useGetTaskById(id: string): ApiResult<UserTask> {
  return useApiGet<UserTask>(`/api/tasks/id/${id}`);
}
