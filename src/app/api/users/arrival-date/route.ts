import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import { STATUS, type Task } from '@/types';
import { scheduleTasks } from '@/utils/task-scheduler';

// Расширяем тип Task для внутреннего использования
interface SchedulableTask extends Task {
    user_task_id: number;
}

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { arrival_date } = await request.json();

        // Start transaction
        await db.query('BEGIN');

        // Update user's arrival date
        const updateUserResult = await db.query(
            `UPDATE users 
            SET arrival_date = $1
            WHERE email = $2
            RETURNING id`,
            [arrival_date, session.user.email],
        );

        if (updateUserResult.rows.length === 0) {
            await db.query('ROLLBACK');
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = updateUserResult.rows[0].id;

        // Mark arrival date task (id: 2) as finished
        await db.query(
            `UPDATE user_tasks 
            SET status = 'finished',
                proof_status = 'proofed'
            WHERE user_id = $1 AND document_task_id = 2`,
            [userId],
        );

        // Get all tasks that need scheduling
        const tasksResult = await db.query(
            `SELECT ut.id as user_task_id, ut.status, ut.available, ut.proof_status,
                    t.id, t.title, t.description, t.required, t.position,
                    t.blocks, t.blocked_by, t.tags, t.schedule,
                    t.priority, t.deadline_days, t.duration_minutes,
                    t.proof, t.documents, t.links, t.medical_procedures,
                    t.address, t.contacts, t.cost, t.clubs
            FROM user_tasks ut
            JOIN tasks t ON ut.document_task_id = t.id
            WHERE ut.user_id = $1 
            AND ut.document_task_id != 2
            AND ut.status != $2`,
            [userId, STATUS.FINISHED],
        );

        // Convert rows to Task objects
        const tasks: SchedulableTask[] = tasksResult.rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            required: row.required,
            position: row.position,
            blocks: row.blocks || [],
            blocked_by: row.blocked_by || [],
            tags: row.tags || [],
            schedule: row.schedule,
            priority: row.priority,
            deadline_days: row.deadline_days,
            duration_minutes: row.duration_minutes,
            status: row.status,
            available: row.available,
            proof_status: row.proof_status,
            picked_date: row.picked_date || new Date(arrival_date),
            experience_points: 0,
            proof: row.proof,
            documents: row.documents,
            links: row.links,
            medical_procedures: row.medical_procedures,
            address: row.address,
            contacts: row.contacts,
            cost: row.cost,
            clubs: row.clubs,
            user_task_id: row.user_task_id,
        }));

        // Schedule tasks using our algorithm
        const scheduledTasks = scheduleTasks(tasks, new Date(arrival_date));

        // Update picked_dates in database
        for (const task of scheduledTasks as SchedulableTask[]) {
            if (task.picked_date) {
                await db.query(
                    `UPDATE user_tasks 
                    SET picked_date = $1,
                        available = $2
                    WHERE id = $3`,
                    [task.picked_date, task.available, task.user_task_id],
                );
            }
        }

        // Commit transaction
        await db.query('COMMIT');

        // Return updated user data
        const userQuery = await db.query(
            `SELECT u.id, u.name, u.email, u.image, u.arrival_date, u.sex, u.country, u.study_group, u.experience, u.level,
                json_agg(json_build_object(
                    'id', ut.id,
                    'status', ut.status,
                    'experience_points', ut.experience_points,
                    'title', t.title::jsonb,
                    'description', t.description::jsonb,
                    'position', t.position,
                    'schedule', t.schedule,
                    'proof', t.proof,
                    'documents', t.documents,
                    'links', t.links,
                    'medical_procedures', t.medical_procedures,
                    'address', t.address,
                    'contacts', t.contacts,
                    'cost', t.cost,
                    'proof_status', ut.proof_status,
                    'available', ut.available,
                    'picked_date', ut.picked_date
                )) AS tasks
            FROM users u
            LEFT JOIN user_tasks ut ON u.id = ut.user_id
            LEFT JOIN tasks t ON ut.document_task_id = t.id
            WHERE u.id = $1
            GROUP BY u.id;`,
            [userId],
        );

        const user = userQuery.rows[0];
        user.arrival_date = user.arrival_date ? new Date(user.arrival_date) : null;

        return NextResponse.json({ success: true, user });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error setting arrival date:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
