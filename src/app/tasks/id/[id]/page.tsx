'use client';

import { useParams } from 'next/navigation';

import { TaskCard } from '@/components/task-card';
import { ProofTask } from '@/components/task-proof';
import { useGetTaskById } from '@/hooks/api/entities/tasks/useGetTaskById';
import { STATUS } from '@/types';

const TaskPage = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id?.[0] : params.id || '';

    const { data: task, error, loading } = useGetTaskById(id);

    if (error) {
        return <div>Error loading task: {error.message}</div>;
    }
    if (loading || !task) {
        return <div>Loading...</div>;
    }

    return (
        <main className="p-4">
            <TaskCard task={task} />
            {task.status !== STATUS.FINISHED && task.proof && <ProofTask task={task} />}
        </main>
    );
};

export default TaskPage;
