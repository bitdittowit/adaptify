"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetTaskById } from '@/hooks/api/entities/tasks/useGetTaskById';
import { TaskCard } from '@/components/task-card';

const TaskPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return <div>Error: No ID provided</div>;
  }

  const { data: task, error } = useGetTaskById(id);

  if (error) return <div>Error loading task: {error.message}</div>;
  if (!task) return <div>Loading...</div>;

  return (
    <main className="p-4">
      <TaskCard task={task}/>
    </main>
  );
};

export default TaskPage;
