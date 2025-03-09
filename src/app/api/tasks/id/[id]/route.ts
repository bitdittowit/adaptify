import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const taskId = Number.parseInt(id, 10);

    if (Number.isNaN(taskId)) {
        return NextResponse.json({ error: `Invalid task ID: ${id}` }, { status: 400 });
    }

    try {
        const taskQuery = await db.query(
            `
      SELECT ut.id, ut.status, ut.experience_points,
             t.title::jsonb, t.description::jsonb, t.schedule, t.proof, ut.proof_status,
             t.documents::jsonb->'items' as documents,
             t.links::jsonb->'items' as links,
             t.medical_procedures::jsonb->'items' as medical_procedures,
             t.address::jsonb->'items' as address,
             t.contacts::jsonb as contacts,
             t.cost::jsonb as cost
      FROM user_tasks ut
      LEFT JOIN tasks t ON ut.document_task_id = t.id
      WHERE ut.id = $1;
      `,
            [taskId],
        );

        if (taskQuery.rows.length === 0) {
            return NextResponse.json({ error: `No task with ID ${id}` }, { status: 404 });
        }

        const task = taskQuery.rows[0];

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
