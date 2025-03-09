import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

async function getUserTasks(email: string) {
    const client = db;

    try {
        const userQuery = await client.query(
            `
          SELECT u.id, u.name, u.arrival_date, u.sex, u.country, u.study_group, u.experience, u.level,
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
              'available', ut.available
            )) AS tasks
          FROM users u
          LEFT JOIN user_tasks ut ON u.id = ut.user_id
          LEFT JOIN tasks t ON ut.document_task_id = t.id
          WHERE u.email = $1 
            AND ut.available = TRUE
            AND ut.status != 'finished'
          GROUP BY u.id;
        `,
            [email],
        );

        if (userQuery.rows.length === 0) {
            return null;
        }

        const user = userQuery.rows[0];
        user.arrival_date = user.arrival_date ? new Date(user.arrival_date) : null;

        return user;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Error fetching user data');
    }
}

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await getUserTasks(session.user.email);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.tasks) {
            return NextResponse.json({ error: 'Tasks not found' }, { status: 404 });
        }

        return NextResponse.json(user.tasks);
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
