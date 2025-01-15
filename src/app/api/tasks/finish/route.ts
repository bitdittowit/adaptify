import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { STATUS } from '@/types';

export async function POST(request: NextRequest) {
    const { id } = await request.json();
    const client = db;

    try {
        await client.query('BEGIN');

        // Retrieve task and user data.
        const taskQuery = await client.query(
            `SELECT ut.id, ut.status, ut.experience_points, ut.user_id, ut.document_task_id, u.experience, u.level, u.completed_tasks
            FROM user_tasks ut
            JOIN users u ON ut.user_id = u.id
            WHERE ut.id = $1;`,
            [id],
        );

        if (taskQuery.rows.length === 0) {
            throw new Error(`No task with id ${id}`);
        }

        const task = taskQuery.rows[0];

        if (task.status === STATUS.FINISHED) {
            throw new Error(`Task with id ${id} is already finished.`);
        }

        // Update task status to finished.
        await client.query(
            `UPDATE user_tasks
            SET status = $1
            WHERE id = $2;`,
            [STATUS.FINISHED, id],
        );

        // Update user's experience and level.
        const newExperience = Number(task.experience) + Number(task.experience_points);
        const newLevel = Math.floor(newExperience / 200);

        // Add finished task to user's completed_tasks.
        const updatedCompletedTasks = [...task.completed_tasks, id];

        await client.query(
            `UPDATE users
            SET experience = $1, level = $2, completed_tasks = $3
            WHERE id = $4;`,
            [newExperience, newLevel, updatedCompletedTasks, task.user_id],
        );

        // Find tasks that can be unlocked.
        const blockedTasksQuery = await client.query(
            `SELECT ut.id
            FROM user_tasks ut
            JOIN tasks t ON ut.document_task_id = t.id
            WHERE ut.available = false AND $1 = ANY(t.blocked_by);`,
            [task.document_task_id],
        );

        for (const blockedTask of blockedTasksQuery.rows) {
            // Check if all blocking tasks are completed.
            const blockedByQuery = await client.query(
                `SELECT t.blocks
                FROM tasks t
                WHERE t.id = $1;`,
                [blockedTask.id],
            );

            const blockedBy = blockedByQuery.rows[0].blocks;
            console.log('blockedBy', blockedBy);

            const allDependenciesCompleted = blockedBy.every((dependencyId: string) =>
                updatedCompletedTasks.includes(dependencyId),
            );

            console.log('allDependenciesCompleted', allDependenciesCompleted);
            if (allDependenciesCompleted) {
                await client.query(
                    `UPDATE user_tasks
                    SET available = true
                    WHERE id = $1;`,
                    [blockedTask.id],
                );
            }
        }

        await client.query('COMMIT');
        return NextResponse.json({
            success: true,
            user: { id: task.user_id, experience: newExperience, level: newLevel },
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating task status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
