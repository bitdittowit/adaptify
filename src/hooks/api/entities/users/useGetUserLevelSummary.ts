import useApiGet from '@/hooks/api/useApiGet';
import type { UserLevelSummary } from '@/types';
import type { ApiResult } from '@/types/api';

export function useGetUserLevelSummary(): ApiResult<UserLevelSummary> {
    return useApiGet<UserLevelSummary>('/api/users/level_summary');
}
