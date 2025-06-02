import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const userQuery = await db.query(
            `SELECT role FROM users WHERE email = $1`,
            [session.user.email]
        );

        if (userQuery.rows.length === 0 || userQuery.rows[0].role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        // Get all tasks ordered by position
        const tasksQuery = await db.query(
            `SELECT 
                t.id, 
                t.title::jsonb, 
                t.description::jsonb, 
                t.required, 
                t.position, 
                t.blocks, 
                t.blocked_by, 
                t.tags,
                t.schedule,
                t.priority,
                t.deadline_days,
                t.duration_minutes,
                COUNT(ut.id) as assigned_count
            FROM tasks t
            LEFT JOIN user_tasks ut ON t.id = ut.document_task_id
            GROUP BY t.id
            ORDER BY t.position ASC`
        );

        return NextResponse.json(tasksQuery.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const userQuery = await db.query(
            `SELECT role FROM users WHERE email = $1`,
            [session.user.email]
        );

        if (userQuery.rows.length === 0 || userQuery.rows[0].role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const taskData = await request.json();

        // Get the highest position to place the new task at the end
        const positionQuery = await db.query(
            `SELECT MAX(position) as max_position FROM tasks`
        );
        const newPosition = (positionQuery.rows[0].max_position || 0) + 1;

        // Check and fix the ID sequence if needed
        const tableInfoQuery = await db.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = 'id'
        `);

        const idColumnInfo = tableInfoQuery.rows[0];
        console.log("Current tasks.id column info:", idColumnInfo);

        // If the ID column doesn't have a sequence default value, set it up
        if (!idColumnInfo.column_default || !idColumnInfo.column_default.includes('nextval')) {
            const sequenceName = 'tasks_id_seq';
            await db.query(`
                DO $$
                BEGIN
                    -- Check if the sequence already exists
                    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = '${sequenceName}') THEN
                        -- Create sequence
                        CREATE SEQUENCE ${sequenceName} START 1;
                    END IF;

                    -- Set default for id column
                    ALTER TABLE tasks ALTER COLUMN id SET DEFAULT nextval('${sequenceName}');
                    
                    -- Set the sequence to the maximum ID + 1
                    PERFORM setval('${sequenceName}', COALESCE((SELECT MAX(id) FROM tasks), 0) + 1, false);
                END
                $$;
            `);
            console.log("Created sequence and set ID column default");
        } else {
            // Extract the sequence name from the default value
            const match = idColumnInfo.column_default.match(/nextval\('([^']+)'/);
            if (match) {
                const sequenceName = match[1];
                
                // Reset the sequence to the maximum ID + 1
                await db.query(`
                    SELECT setval('${sequenceName}', COALESCE((SELECT MAX(id) FROM tasks), 0) + 1, false);
                `);
                console.log("Reset sequence to the max ID + 1");
            }
        }

        // Insert new task
        const insertResult = await db.query(
            `INSERT INTO tasks (
                title,
                description,
                required,
                position,
                blocks,
                blocked_by,
                tags,
                schedule,
                priority,
                deadline_days,
                duration_minutes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id`,
            [
                JSON.stringify(taskData.title),
                JSON.stringify(taskData.description),
                taskData.required,
                newPosition,
                taskData.blocks || [],
                taskData.blocked_by || [],
                taskData.tags || [],
                taskData.schedule || null,
                taskData.priority || 3,  // Default priority is medium (3)
                taskData.deadline_days,
                taskData.duration_minutes
            ]
        );

        const newTaskId = insertResult.rows[0].id;
        console.log("New task created with ID:", newTaskId);

        return NextResponse.json({
            success: true,
            id: newTaskId,
            message: 'Task created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 