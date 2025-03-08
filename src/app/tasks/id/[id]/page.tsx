'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { TaskCard } from '@/components/tasks/task-card';
import { ProofTask } from '@/components/tasks/task-proof';
import { useGetTaskById } from '@/hooks/api/entities/tasks/use-get-task-by-id';
import { STATUS } from '@/types';

const TaskPage = () => {
    const t = useTranslations();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id?.[0] : params.id || '';

    const { data: task, error, loading } = useGetTaskById(id);

    if (error) {
        return <div>{t('task.error', { message: error.message })}</div>;
    }
    if (loading || !task) {
        return <div>{t('task.loading')}</div>;
    }

    return (
        <main className="p-4">
            <TaskCard task={task} />
            {task.status !== STATUS.FINISHED && task.proof && <ProofTask task={task} />}
        </main>
    );
};

export default TaskPage;
