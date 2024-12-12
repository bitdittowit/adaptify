import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = (await params);

  const taskId = parseInt(id, 10);

  if (isNaN(taskId)) {
    return NextResponse.json(
      { error: `Invalid task ID: ${id}` },
      { status: 400 }
    );
  }

  const client = db;

  try {
    const taskQuery = await client.query(
      `
      SELECT ut.id, ut.status, ut.experience_points,
              t.title, t.description, t.schedule, t.proof, ut.proof_status
      FROM user_tasks ut
      LEFT JOIN tasks t ON ut.document_task_id = t.id
      WHERE ut.id = $1;
      `,
      [taskId]
    );

    if (taskQuery.rows.length === 0) {
      return NextResponse.json(
        { error: `No task with ID ${id}` },
        { status: 404 }
      );
    }

    const task = taskQuery.rows[0];

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}