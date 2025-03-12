import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
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
                    'available', ut.available
                )) AS tasks
            FROM users u
            LEFT JOIN user_tasks ut ON u.id = ut.user_id
            LEFT JOIN tasks t ON ut.document_task_id = t.id
            WHERE u.email = $1
            GROUP BY u.id;`,
            [session.user.email],
        );

        if (userQuery.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = userQuery.rows[0];
        user.arrival_date = user.arrival_date ? new Date(user.arrival_date) : null;

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
