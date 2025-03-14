'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ArrowLeft, ArrowRight, ChevronLeft, LockKeyhole } from 'lucide-react';

import { TaskCard } from '@/components/tasks/task-card';
import { ProofTask } from '@/components/tasks/task-proof';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocalizedText } from '@/components/ui/localized-text';
import { useGetRelatedTasks } from '@/hooks/api/entities/tasks/use-get-related-tasks';
import { useGetTaskById } from '@/hooks/api/entities/tasks/use-get-task-by-id';
import { useBreakpoint } from '@/hooks/use-mobile';
import { STATUS } from '@/types';
import type { LocalizedText as LocalizedTextType } from '@/types';

// Интерфейс для вспомогательных компонентов
interface RelatedTaskItem {
    id: number;
    title: LocalizedTextType;
}

// Импортируем определение из хука, чтобы избежать конфликта имен
interface GetRelatedTasksResponse {
    previous: RelatedTaskItem | null;
    next: RelatedTaskItem | null;
    blocked_tasks: RelatedTaskItem[];
}

interface TaskNavigationProps {
    relatedTasks: GetRelatedTasksResponse | null;
    isMobile: boolean;
}

interface BlockedTasksListProps {
    blockedTasks?: RelatedTaskItem[];
    isMobile: boolean;
}

// Компонент для кнопки "Назад"
const BackButton = () => {
    const t = useTranslations();
    return (
        <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/tasks">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('common.back')}
            </Link>
        </Button>
    );
};

// Компонент для навигационных кнопок между задачами
const TaskNavigation = ({ relatedTasks, isMobile }: TaskNavigationProps) => {
    return (
        <div className={`flex justify-between items-center`}>
            {relatedTasks?.previous ? (
                <Button variant="outline" size={isMobile ? 'sm' : 'default'} asChild className={isMobile ? 'px-2' : ''}>
                    <Link href={`/tasks/id/${relatedTasks.previous.id}`}>
                        <ArrowLeft className={`${isMobile ? 'mr-1' : 'mr-2'} h-4 w-4`} />
                        {!isMobile && <LocalizedText text={relatedTasks.previous.title} />}
                        {isMobile && 'Пред.'}
                    </Link>
                </Button>
            ) : (
                <div />
            )}
            {relatedTasks?.next ? (
                <Button variant="outline" size={isMobile ? 'sm' : 'default'} asChild className={isMobile ? 'px-2' : ''}>
                    <Link href={`/tasks/id/${relatedTasks.next.id}`}>
                        {!isMobile && <LocalizedText text={relatedTasks.next.title} />}
                        {isMobile && 'След.'}
                        <ArrowRight className={`${isMobile ? 'ml-1' : 'ml-2'} h-4 w-4`} />
                    </Link>
                </Button>
            ) : (
                <div />
            )}
        </div>
    );
};

// Компонент для отображения заблокированных задач
const BlockedTasksList = ({ blockedTasks, isMobile }: BlockedTasksListProps) => {
    const t = useTranslations();

    if (!blockedTasks || blockedTasks.length === 0) {
        return null;
    }

    return (
        <Card className={isMobile ? 'p-3' : ''}>
            <CardHeader className={isMobile ? 'p-3 pb-0' : ''}>
                <CardTitle className={isMobile ? 'text-base' : ''}>{t('task.blockedTasks')}</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? 'p-3' : ''}>
                <div className="space-y-2">
                    {blockedTasks.map(blockedTask => (
                        <div key={blockedTask.id} className="flex items-center gap-2">
                            <LockKeyhole className="h-4 w-4 flex-shrink-0" />
                            <Link href={`/tasks/id/${blockedTask.id}`} className="text-sm hover:underline truncate">
                                <LocalizedText text={blockedTask.title} />
                            </Link>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const TaskPage = () => {
    const t = useTranslations();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id?.[0] : params.id || '';
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    const { data: task, error, loading } = useGetTaskById(id);
    const { data: relatedTasks, loading: relatedLoading } = useGetRelatedTasks(id);

    if (error) {
        return <div className="p-4 text-destructive">{t('task.error', { message: error.message })}</div>;
    }
    if (loading || !task) {
        return <div className="p-4">{t('task.loading')}</div>;
    }

    return (
        <main className={`${isMobile ? 'p-2' : 'p-4'} space-y-4 max-w-4xl mx-auto`}>
            <div className="flex items-center mb-4">
                <BackButton />
            </div>

            <TaskNavigation relatedTasks={relatedTasks} isMobile={isMobile} />

            <div className="my-4">
                <TaskCard task={task} className={isMobile ? 'p-3' : ''} />
            </div>

            {task.status !== STATUS.FINISHED && task.proof && (
                <div className="mt-4">
                    <ProofTask task={task} />
                </div>
            )}

            {!relatedLoading && relatedTasks && relatedTasks.blocked_tasks && (
                <BlockedTasksList blockedTasks={relatedTasks.blocked_tasks} isMobile={isMobile} />
            )}
        </main>
    );
};

export default TaskPage;
