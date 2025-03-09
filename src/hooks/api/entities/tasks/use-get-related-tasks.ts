import useApiGet from '@/hooks/api/use-api-get';
import type { ApiResult } from '@/types/api';

interface RelatedTasks {
    previous: { id: number; title: string } | null;
    next: { id: number; title: string } | null;
    blocked_tasks: Array<{ id: number; title: string }>;
}

export function useGetRelatedTasks(id: string): ApiResult<RelatedTasks> {
    return useApiGet<RelatedTasks>(`/api/tasks/id/${id}/related`);
}
