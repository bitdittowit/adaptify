import { BaseTask } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "@/hooks/api/useApiGet";

export function useGetTasksByDate(date: string): ApiResult<BaseTask> {
  return useApiGet<BaseTask>(`/api/tasks/date/${date}`);
}
