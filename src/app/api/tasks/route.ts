import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

async function getDefaultUser() {
  const client = db;

  try {
    const userQuery = await client.query(`
      SELECT u.id, u.name, u.arrival_date, u.sex, u.country, u.study_group, u.experience, u.level,
        json_agg(json_build_object(
          'id', ut.id,
          'status', ut.status,
          'experience_points', ut.experience_points,
          'title', t.title,
          'description', t.description,
          'position', t.position,
          'schedule', t.schedule
        )) AS tasks
      FROM users u
      LEFT JOIN user_tasks ut ON u.id = ut.user_id
      LEFT JOIN tasks t ON ut.document_task_id = t.id
      WHERE u.name = $1
      GROUP BY u.id;
    `, ['John Doe']);

    if (userQuery.rows.length === 0) {
      return null;
    }

    const user = userQuery.rows[0];
    console.log('user', user)
    user.arrival_date = user.arrival_date ? new Date(user.arrival_date) : null;

    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Error fetching user data');
  }
}

export async function GET() {
  try {
    const user = await getDefaultUser();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.tasks) {
      return NextResponse.json({ error: 'Tasks not found' }, { status: 404 });
    }

    return NextResponse.json(user.tasks);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
