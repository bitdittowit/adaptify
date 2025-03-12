import type { Task } from '@/types';

import useApiGet from './use-api-get';

export function useTasks() {
    const { data: tasks, loading, error } = useApiGet<Task[]>('/api/tasks');
    return { tasks: tasks || [], isLoading: loading, error };
}
