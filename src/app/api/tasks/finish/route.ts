import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { STATUS } from '@/types';

export async function POST(request: NextRequest) {
    const { id } = await request.json();

    const client = db;

    try {
        await client.query('BEGIN');

        const taskQuery = await client.query(
            `SELECT ut.id, ut.status, ut.experience_points, ut.user_id, u.experience, u.level
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
            throw new Error(`Task with id ${id} is already finished`);
        }

        await client.query(
            `UPDATE user_tasks
      SET status = $1
      WHERE id = $2;`,
            [STATUS.FINISHED, id],
        );

        const newExperience = Number(task.experience) + Number(task.experience_points);
        const newLevel = Math.floor(newExperience / 200);

        await client.query(
            `UPDATE users
      SET experience = $1, level = $2
      WHERE id = $3;`,
            [newExperience, newLevel, task.user_id],
        );

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
