import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(request: NextRequest) {
    const { arrival_date, taskId } = await request.json();

    try {
        await db.query('BEGIN');

        await db.query(
            `UPDATE users
      SET arrival_date = $1
      WHERE name = $2;`,
            [arrival_date, 'John Doe'],
        );

        const userResult = await db.query('SELECT id FROM users WHERE name = $1;', ['John Doe']);

        const userId = userResult.rows[0]?.id;

        if (!userId) {
            throw new Error('User not found');
        }

        await db.query(
            `UPDATE user_tasks
      SET proof_status = $1
      WHERE user_id = $2 AND document_task_id = $3;`,
            ['proofed', userId, taskId],
        );

        await db.query('COMMIT');

        return NextResponse.json({
            success: true,
            result: {
                arrival_date: arrival_date,
                user_task: { taskId, proof_status: 'proofed' },
            },
        });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error updating arrival_date or proof status:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : ' Unknown error',
            },
            { status: 500 },
        );
    }
}
