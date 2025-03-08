'use client';

import { useTranslations } from 'next-intl';

import { TaskPreviewCard } from '@/components/tasks/task-preview-card';
import { useGetTasks } from '@/hooks/api/entities/tasks/use-get-tasks';

export default function Page() {
    const t = useTranslations();
    const { data, loading } = useGetTasks();

    if (loading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <main
            className=" block w-full p-4 grid place-content-center gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
        >
            {data.map((task, index) => (
                <div key={task.id} className="grid gap-2 grid-cols-1 xl:grid-cols-[40px_1fr]">
                    <span className="mt-1 bg-primary rounded w-10 h-10 grid place-items-center text-primary-foreground">
                        {index + 1}
                    </span>
                    <TaskPreviewCard task={task} />
                </div>
            ))}
        </main>
    );
}
