import { UserLevelSummary } from "@/types";
import { ApiResult } from "@/types/api";
import useApiGet from "@/hooks/api/useApiGet";

export function useGetUserLevelSummary(): ApiResult<UserLevelSummary> {
  return useApiGet<UserLevelSummary>('/api/users/level_summary');
}
