import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { User } from '@/types';
import { ApiResult } from '@/types/api';

/**
 * Hook to get all users (admin only)
 */
export function useGetAllUsers(): ApiResult<User[]> {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/admin/users', {
                    withCredentials: true
                });
                setData(response.data);
                setError(null);
            } catch (err: unknown) {
                console.error('Error fetching admin users:', err);
                let errorMessage = 'Unknown error';
                
                if (err instanceof AxiosError) {
                    errorMessage = err.response?.data?.error || err.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                
                setError(new Error(`Failed to fetch users: ${errorMessage}`));
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, error, loading };
} 