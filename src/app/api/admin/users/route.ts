import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET() {
    try {
        const session = await getServerSession();
        
        // Debug session
        console.log('Admin users API - Session:', JSON.stringify({
            email: session?.user?.email,
            role: session?.user?.role
        }));

        // Check if user is authenticated
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        
        // Verify user is admin by checking the database directly
        const adminCheck = await db.query(
            'SELECT role FROM users WHERE email = $1',
            [session.user.email]
        );
        
        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        // Fetch all users from the database
        const result = await db.query(
            `SELECT id, name, email, image, role, sex, country, study_group, experience, level 
             FROM users 
             ORDER BY study_group, name`
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: String(error) },
            { status: 500 }
        );
    }
} 