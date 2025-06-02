import { useCallback, useEffect, useState } from 'react';
import { BaseTask } from '@/types';

interface AdminTask extends BaseTask {
    assigned_count: number;
}

interface UseGetAdminTasksReturn {
    data: AdminTask[] | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useGetAdminTasks(): UseGetAdminTasksReturn {
    const [data, setData] = useState<AdminTask[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/admin/tasks');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch tasks');
            }
            
            const tasks = await response.json();
            setData(tasks);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { data, loading, error, refetch: fetchTasks };
} 