import { Task } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "@/hooks/api/useApiGet";

export function useGetTaskById(id: string): ApiResult<Task> {
  return useApiGet<Task>(`/api/tasks/id/${id}`);
}
