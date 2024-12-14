import type { Task } from '@/types';
import type { ApiResult } from '@/types/api';

import useApiGet from '../../useApiGet';

export function useGetTasks(): ApiResult<Task[]> {
    return useApiGet<Task[]>('/api/tasks');
}
