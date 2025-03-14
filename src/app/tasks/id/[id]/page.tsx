'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft, ArrowRight, ChevronLeft, Lock, LockKeyhole } from 'lucide-react';

import { TaskCard } from '@/components/tasks/task-card';
import { ProofTask } from '@/components/tasks/task-proof';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocalizedText } from '@/components/ui/localized-text';
import { useGetRelatedTasks } from '@/hooks/api/entities/tasks/use-get-related-tasks';
import { useGetTaskById } from '@/hooks/api/entities/tasks/use-get-task-by-id';
import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
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
    const router = useRouter();

    return (
        <Button variant="ghost" className="gap-2 pl-1" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
            {t('common.back')}
        </Button>
    );
};

// Компонент для навигационных кнопок между задачами
const TaskNavigation = ({ relatedTasks, isMobile }: TaskNavigationProps) => {
    const t = useTranslations();

    if (!relatedTasks) {
        return null;
    }

    const hasNavigation = relatedTasks.previous || relatedTasks.next;
    if (!hasNavigation) {
        return null;
    }

    return (
        <div className={cn('flex gap-2', isMobile ? 'justify-between' : 'justify-center')}>
            {relatedTasks.previous && (
                <Button variant="outline" className="gap-2 min-w-[120px]" asChild>
                    <Link href={`/tasks/id/${relatedTasks.previous.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="truncate">
                            {isMobile ? (
                                t('common.navigation.previous')
                            ) : (
                                <LocalizedText text={relatedTasks.previous.title} />
                            )}
                        </span>
                    </Link>
                </Button>
            )}
            {relatedTasks.next && (
                <Button variant="outline" className="gap-2 min-w-[120px]" asChild>
                    <Link href={`/tasks/id/${relatedTasks.next.id}`}>
                        <span className="truncate">
                            {isMobile ? t('common.navigation.next') : <LocalizedText text={relatedTasks.next.title} />}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
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
        <Card className="bg-muted/50 overflow-hidden group">
            <CardHeader
                className={cn(
                    'flex flex-row items-center justify-between gap-4 border-b transition-colors',
                    'group-hover:bg-primary/5 group-hover:border-primary/10',
                    isMobile ? 'p-3' : 'p-4',
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/10 rounded-full transition-all group-hover:scale-110" />
                        <LockKeyhole
                            className={cn(
                                'relative text-primary transition-transform',
                                'group-hover:scale-110 group-hover:rotate-12',
                                isMobile ? 'h-4 w-4' : 'h-5 w-5',
                            )}
                        />
                    </div>
                    <CardTitle
                        className={cn('transition-colors group-hover:text-primary', isMobile ? 'text-base' : 'text-lg')}
                    >
                        {t('task.blockedTasks')}
                    </CardTitle>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        'font-normal transition-colors',
                        'group-hover:border-primary/40 group-hover:text-primary',
                        isMobile ? 'text-xs px-2' : 'text-sm px-2.5',
                    )}
                >
                    {blockedTasks.length}
                </Badge>
            </CardHeader>
            <CardContent className={cn('grid gap-2', isMobile ? 'p-3' : 'p-4')}>
                {blockedTasks.map(blockedTask => (
                    <Link
                        key={blockedTask.id}
                        href={`/tasks/id/${blockedTask.id}`}
                        className={cn(
                            'group/item flex items-center gap-3 p-2 rounded-lg transition-all',
                            'hover:bg-primary/5',
                        )}
                    >
                        <div className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 transition-opacity group-hover/item:opacity-100" />
                            <Lock
                                className={cn(
                                    'relative text-primary/75 transition-all',
                                    'group-hover/item:scale-110 group-hover/item:rotate-12',
                                    isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4',
                                )}
                            />
                        </div>
                        <span
                            className={cn(
                                'flex-1 truncate transition-colors',
                                'group-hover/item:text-primary',
                                isMobile ? 'text-sm' : 'text-base',
                            )}
                        >
                            <LocalizedText text={blockedTask.title} />
                        </span>
                        <ArrowRight
                            className={cn(
                                'text-muted-foreground transition-transform',
                                'group-hover/item:translate-x-0.5 group-hover/item:text-primary',
                                isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4',
                            )}
                        />
                    </Link>
                ))}
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
        return (
            <div className="w-full max-w-4xl mx-auto px-2 py-4 md:py-6">
                <Card className="bg-destructive/10 border-destructive/50">
                    <CardContent className="p-4">
                        <div className="text-destructive">{t('task.error', { message: error.message })}</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading || !task) {
        return (
            <div className="w-full max-w-4xl mx-auto px-2 py-4 md:py-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-center p-8 animate-pulse">{t('task.loading')}</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <main className="w-full max-w-4xl mx-auto px-2 py-4 md:py-6">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>

            <div className="space-y-4">
                <TaskNavigation relatedTasks={relatedTasks} isMobile={isMobile} />

                <TaskCard task={task} />

                {task.status !== STATUS.FINISHED && task.proof && <ProofTask task={task} />}

                {!relatedLoading && relatedTasks && relatedTasks.blocked_tasks && (
                    <BlockedTasksList blockedTasks={relatedTasks.blocked_tasks} isMobile={isMobile} />
                )}
            </div>
        </main>
    );
};

export default TaskPage;
