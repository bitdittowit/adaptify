import useApiGet from '@/hooks/api/use-api-get';
import type { User } from '@/types';
import type { ApiResult } from '@/types/api';

export function useGetUsers(): ApiResult<User> {
    return useApiGet<User>('/api/users');
}
