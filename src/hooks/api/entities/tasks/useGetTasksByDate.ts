import { Task } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "@/hooks/api/useApiGet";

export function useGetTasksByDate(date: string): ApiResult<Task> {
  return useApiGet<Task>(`/api/tasks/date/${date}`);
}
