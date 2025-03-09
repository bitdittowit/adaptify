import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import type { User } from '@/types';

const client = db;

async function getUserSummary(email: string): Promise<User | null> {
    try {
        const userQuery = await client.query(
            `
      SELECT u.id, u.name, u.arrival_date, u.sex, u.country, u.study_group, u.experience, u.level,
        json_agg(json_build_object(
          'id', ut.id,
          'status', ut.status,
          'experience_points', ut.experience_points,
          'title', dt.title,
          'description', dt.description
        )) AS tasks
      FROM users u
      LEFT JOIN user_tasks ut ON u.id = ut.user_id
      LEFT JOIN tasks dt ON ut.document_task_id = dt.id
      WHERE u.email = $1
      GROUP BY u.id;
    `,
            [email],
        );

        if (userQuery.rows.length === 0) {
            return null;
        }

        const user = userQuery.rows[0];
        user.arrival_date = user.arrival_date ? new Date(user.arrival_date) : null;

        return user as User;
    } catch (error) {
        console.error('error', error);
        throw new Error('Error fetching user data');
    }
}

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await getUserSummary(session.user.email);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const totalExperience = user.tasks.reduce((total, task) => total + task.experience_points, 0);

        return NextResponse.json({
            level: user.level,
            experience: user.experience,
            totalExperience,
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
