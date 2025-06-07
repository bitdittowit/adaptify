import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
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

        // Get table info
        const tableInfoQuery = await db.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = 'id'
        `);

        const idColumnInfo = tableInfoQuery.rows[0];
        console.log("Current tasks.id column info:", idColumnInfo);

        let sequenceCreated = false;
        let sequenceName = null;

        // Check if ID column has a default value with a sequence
        if (!idColumnInfo.column_default || !idColumnInfo.column_default.includes('nextval')) {
            // Create a sequence for the ID column if it doesn't exist
            sequenceName = 'tasks_id_seq';
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
            sequenceCreated = true;
        } else {
            // Extract the sequence name from the default value
            const match = idColumnInfo.column_default.match(/nextval\('([^']+)'/);
            if (match) {
                sequenceName = match[1];
                
                // Reset the sequence to the maximum ID + 1
                await db.query(`
                    SELECT setval('${sequenceName}', COALESCE((SELECT MAX(id) FROM tasks), 0) + 1, false);
                `);
            }
        }

        // Get updated table info
        const updatedTableInfoQuery = await db.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = 'id'
        `);

        return NextResponse.json({
            before: idColumnInfo,
            after: updatedTableInfoQuery.rows[0],
            sequenceCreated,
            sequenceName,
            message: sequenceCreated 
                ? 'Created sequence and updated ID column to use it' 
                : 'ID column already has a sequence'
        });
    } catch (error) {
        console.error('Error fixing schema:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 