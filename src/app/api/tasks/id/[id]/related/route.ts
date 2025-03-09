import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const taskId = Number.parseInt(id, 10);

    if (Number.isNaN(taskId)) {
        return NextResponse.json({ error: `Invalid task ID: ${id}` }, { status: 400 });
    }

    try {
        // Get current task's document_task_id and position
        const currentTaskQuery = await db.query(
            `
            SELECT ut.document_task_id, t.position, t.blocks
            FROM user_tasks ut
            JOIN tasks t ON ut.document_task_id = t.id
            WHERE ut.id = $1;
            `,
            [taskId],
        );

        if (currentTaskQuery.rows.length === 0) {
            return NextResponse.json({ error: `No task with ID ${id}` }, { status: 404 });
        }

        const currentTask = currentTaskQuery.rows[0];

        // Get previous and next tasks based on position
        const relatedTasksQuery = await db.query(
            `
            WITH current_task AS (
                SELECT t.position
                FROM tasks t
                WHERE t.id = $1
            )
            SELECT 
                ut.id,
                t.title::jsonb as title,
                t.position,
                CASE 
                    WHEN t.position < (SELECT position FROM current_task) THEN 'previous'
                    WHEN t.position > (SELECT position FROM current_task) THEN 'next'
                END as relation_type
            FROM tasks t
            JOIN user_tasks ut ON t.id = ut.document_task_id
            WHERE t.position = (
                SELECT position - 1 
                FROM current_task
            )
            OR t.position = (
                SELECT position + 1 
                FROM current_task
            )
            AND ut.available = true;
            `,
            [currentTask.document_task_id],
        );

        // Get tasks that are blocked by current task
        const blockedTasksQuery = await db.query(
            `
            SELECT ut.id, t.title::jsonb as title
            FROM tasks t
            JOIN user_tasks ut ON t.id = ut.document_task_id
            WHERE $1 = ANY(t.blocked_by);
            `,
            [currentTask.document_task_id],
        );

        const previousTask = relatedTasksQuery.rows.find(task => task.relation_type === 'previous');
        const nextTask = relatedTasksQuery.rows.find(task => task.relation_type === 'next');

        return NextResponse.json({
            previous: previousTask || null,
            next: nextTask || null,
            blocked_tasks: blockedTasksQuery.rows,
        });
    } catch (error) {
        console.error('Error fetching related tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
