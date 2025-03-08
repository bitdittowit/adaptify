import useApiGet from '@/hooks/api/use-api-get';
import type { BaseTask } from '@/types';
import type { ApiResult } from '@/types/api';

export function useGetTasksByDate(date: string): ApiResult<BaseTask> {
    return useApiGet<BaseTask>(`/api/tasks/date/${date}`);
}
