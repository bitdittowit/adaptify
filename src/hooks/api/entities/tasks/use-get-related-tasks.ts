import useApiGet from '@/hooks/api/use-api-get';
import type { LocalizedText } from '@/types';
import type { ApiResult } from '@/types/api';

interface RelatedTasks {
    previous: { id: number; title: LocalizedText } | null;
    next: { id: number; title: LocalizedText } | null;
    blocked_tasks: Array<{ id: number; title: LocalizedText }>;
}

export function useGetRelatedTasks(id: string): ApiResult<RelatedTasks> {
    return useApiGet<RelatedTasks>(`/api/tasks/id/${id}/related`);
}
