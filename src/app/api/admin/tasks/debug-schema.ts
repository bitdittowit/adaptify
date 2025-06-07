import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function GET() {
    try {
        // Get schema for tasks table
        const schemaQuery = await db.query(`
            SELECT 
                column_name, 
                data_type, 
                is_nullable, 
                column_default 
            FROM 
                information_schema.columns 
            WHERE 
                table_name = 'tasks' 
            ORDER BY 
                ordinal_position
        `);

        // Get sequence information
        const sequenceQuery = await db.query(`
            SELECT 
                pg_get_serial_sequence('tasks', 'id') as id_sequence
        `);

        // Get constraints
        const constraintQuery = await db.query(`
            SELECT
                conname as constraint_name,
                contype as constraint_type,
                pg_get_constraintdef(oid) as constraint_definition
            FROM
                pg_constraint
            WHERE
                conrelid = 'tasks'::regclass
            ORDER BY
                conname
        `);

        return NextResponse.json({
            schema: schemaQuery.rows,
            sequence: sequenceQuery.rows,
            constraints: constraintQuery.rows
        });
    } catch (error) {
        console.error('Error getting schema:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 