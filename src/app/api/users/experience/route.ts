import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { experience } = await request.json();

        const updateResult = await db.query(
            `UPDATE users 
            SET experience = experience + $1,
                level = FLOOR(experience / 200)
            WHERE email = $2
            RETURNING id, name, email, image, arrival_date, sex, country, study_group, experience, level`,
            [experience, session.user.email],
        );

        if (updateResult.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = updateResult.rows[0];
        user.arrival_date = user.arrival_date ? new Date(user.arrival_date) : null;

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Error updating user experience:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
