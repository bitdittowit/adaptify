import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

interface QueryField {
    name: string;
}

// IMPORTANT: REMOVE THIS FILE AFTER TESTING
// This endpoint is only for development testing
export async function POST(request: Request) {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }
    
    try {
        const { query } = await request.json();
        
        if (!query) {
            return NextResponse.json({ error: 'No query provided' }, { status: 400 });
        }
        
        // SECURITY WARNING: This allows any SQL query to be executed!
        // Only use locally during development
        const result = await db.query(query);
        
        return NextResponse.json({
            rows: result.rows,
            columns: result.fields?.map((f: QueryField) => f.name) || [],
            rowCount: result.rowCount
        });
    } catch (error) {
        console.error('Query error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
} 