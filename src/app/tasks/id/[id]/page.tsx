'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';

import { TaskCard } from '@/components/tasks/task-card';
import { ProofTask } from '@/components/tasks/task-proof';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocalizedText } from '@/components/ui/localized-text';
import { useGetRelatedTasks } from '@/hooks/api/entities/tasks/use-get-related-tasks';
import { useGetTaskById } from '@/hooks/api/entities/tasks/use-get-task-by-id';
import { STATUS } from '@/types';

const TaskPage = () => {
    const t = useTranslations();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id?.[0] : params.id || '';

    const { data: task, error, loading } = useGetTaskById(id);
    const { data: relatedTasks, loading: relatedLoading } = useGetRelatedTasks(id);

    if (error) {
        return <div>{t('task.error', { message: error.message })}</div>;
    }
    if (loading || !task) {
        return <div>{t('task.loading')}</div>;
    }

    return (
        <main className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                {relatedTasks?.previous ? (
                    <Button variant="outline" asChild>
                        <Link href={`/tasks/id/${relatedTasks.previous.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <LocalizedText text={relatedTasks.previous.title} />
                        </Link>
                    </Button>
                ) : (
                    <div />
                )}
                {relatedTasks?.next ? (
                    <Button variant="outline" asChild>
                        <Link href={`/tasks/id/${relatedTasks.next.id}`}>
                            <LocalizedText text={relatedTasks.next.title} />
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <div />
                )}
            </div>

            <TaskCard task={task} />
            {task.status !== STATUS.FINISHED && task.proof && <ProofTask task={task} />}

            {!relatedLoading && relatedTasks && relatedTasks.blocked_tasks && relatedTasks.blocked_tasks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('task.blockedTasks')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {relatedTasks.blocked_tasks.map(blockedTask => (
                                <div key={blockedTask.id} className="flex items-center gap-2">
                                    <LockKeyhole className="h-4 w-4" />
                                    <Link href={`/tasks/id/${blockedTask.id}`} className="text-sm hover:underline">
                                        <LocalizedText text={blockedTask.title} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
};

export default TaskPage;
