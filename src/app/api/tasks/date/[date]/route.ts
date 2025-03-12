import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(_request: Request, { params }: { params: Promise<{ date: string }> }) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { date } = await params;
        const targetDate = new Date(date);

        const tasksQuery = await db.query(
            `SELECT ut.id, ut.status, ut.experience_points, ut.proof_status, ut.available, ut.picked_date,
                    t.title, t.description, t.position, t.schedule, t.proof, t.documents, t.links,
                    t.medical_procedures, t.address, t.contacts, t.cost
             FROM user_tasks ut
             JOIN tasks t ON ut.document_task_id = t.id
             JOIN users u ON ut.user_id = u.id
             WHERE u.email = $1
               AND DATE(ut.picked_date) = DATE($2)
               AND ut.available = TRUE
               AND ut.status != 'finished'`,
            [session.user.email, targetDate.toISOString()],
        );

        if (tasksQuery.rows.length === 0) {
            return NextResponse.json({ error: 'No tasks found for given date' }, { status: 404 });
        }

        return NextResponse.json(tasksQuery.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
