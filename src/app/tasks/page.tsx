// import { TasksTable } from '@/components/tasks-table';

'use client';

import { TaskPreviewCard } from '@/components/task-preview-card';
import { useGetTasks } from '@/hooks/api/entities/tasks/useGetTasks';

// import { TasksTable } from '@/components/tasks-table';

export default function Page() {
    const { data, loading } = useGetTasks();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main
            className=" block w-full p-4 grid place-content-center gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
        >
            {data.map((task, index) => (
                <div key={task.id} className="grid gap-2 grid-cols-1 xl:grid-cols-[40px_1fr]">
                    <span className="mt-1 bg-gray-300 rounded w-10 h-10 grid place-items-center text-gray-100">
                        {index + 1}
                    </span>
                    <TaskPreviewCard task={task} />
                </div>
            ))}
        </main>
    );
}
