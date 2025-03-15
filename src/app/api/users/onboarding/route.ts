import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import type { SchedulableTask } from '@/types';

export async function POST(request: NextRequest) {
    console.log('Onboarding API called');
    const session = await getServerSession();
    console.log('Session:', session);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        console.log('No user email found in session');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { country, study_group, sex, arrival_date } = await request.json();
        console.log('Received data:', { country, study_group, sex, arrival_date });

        const hasCountry = Boolean(country);
        const hasStudyGroup = Boolean(study_group);
        const hasSex = Boolean(sex);
        const isMissingData = !(hasCountry && hasStudyGroup && hasSex);

        if (isMissingData) {
            console.log('Missing required data');
            return NextResponse.json({ error: 'Country, study group and sex are required' }, { status: 400 });
        }

        // Начинаем транзакцию
        await db.query('BEGIN');

        // Обновляем профиль пользователя
        const result = await db.query(
            `UPDATE users 
             SET country = $1, study_group = $2, sex = $3, arrival_date = $4
             WHERE email = $5
             RETURNING id, name, email, country, study_group, sex, arrival_date`,
            [country, study_group, sex, arrival_date, userEmail],
        );

        // Если указана дата прилета, планируем задачи
        if (arrival_date) {
            // Получаем все задачи пользователя
            const tasksResult = await db.query(
                `SELECT ut.id as user_task_id, t.* 
                 FROM user_tasks ut
                 JOIN tasks t ON ut.document_task_id = t.id
                 WHERE ut.user_id = $1`,
                [result.rows[0].id],
            );

            // Конвертируем строки в объекты Task и планируем их
            const tasks = tasksResult.rows.map(row => ({
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
                picked_date: row.picked_date,
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
            })) as SchedulableTask[];

            // Импортируем функцию планирования и планируем задачи
            const { scheduleTasks } = await import('@/utils/task-scheduler');
            const scheduledTasks = scheduleTasks(tasks, new Date(arrival_date));

            // Обновляем picked_date для каждой задачи
            for (const task of scheduledTasks) {
                await db.query(
                    `UPDATE user_tasks 
                     SET picked_date = $1,
                         available = $2
                     WHERE id = $3`,
                    [task.picked_date, task.available, task.user_task_id],
                );
            }
        }

        // Завершаем транзакцию
        await db.query('COMMIT');

        console.log('Update result:', result.rows[0]);

        return NextResponse.json({
            success: true,
            user: result.rows[0],
        });
    } catch (error) {
        // В случае ошибки откатываем транзакцию
        await db.query('ROLLBACK');
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Internal Server Error',
            },
            { status: 500 },
        );
    }
}
