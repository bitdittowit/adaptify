import useApiGet from '@/hooks/api/use-api-get';
import type { Task } from '@/types';
import type { ApiResult } from '@/types/api';

export function useGetTasks(): ApiResult<Task[]> {
    return useApiGet<Task[]>('/api/tasks');
}
