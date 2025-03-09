import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

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
        const { country, study_group, sex } = await request.json();
        console.log('Received data:', { country, study_group, sex });

        const hasCountry = Boolean(country);
        const hasStudyGroup = Boolean(study_group);
        const hasSex = Boolean(sex);
        // biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
        const isMissingData = !hasCountry || !hasStudyGroup || !hasSex;

        if (isMissingData) {
            console.log('Missing required data');
            return NextResponse.json({ error: 'Country, study group and sex are required' }, { status: 400 });
        }

        const result = await db.query(
            `UPDATE users 
       SET country = $1, study_group = $2, sex = $3
       WHERE email = $4
       RETURNING id, name, email, country, study_group, sex`,
            [country, study_group, sex, userEmail],
        );

        console.log('Update result:', result.rows[0]);

        return NextResponse.json({
            success: true,
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Internal Server Error',
            },
            { status: 500 },
        );
    }
}
