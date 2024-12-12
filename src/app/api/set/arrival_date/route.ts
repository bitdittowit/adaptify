import { NextRequest, NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  const { arrival_date, taskId } = await request.json();

  try {
    await db.query('BEGIN');

    await db.query(
      `UPDATE users
      SET arrival_date = $1
      WHERE name = $2;`,
      [arrival_date, 'John Doe']
    );

    await db.query(
      `UPDATE tasks
      SET proof = jsonb_set(proof, '{status}', $1::jsonb)
      WHERE id = $2;`,
      [JSON.stringify('proofed'), taskId]
    );

    await db.query('COMMIT');

    return NextResponse.json({
      success: true,
      result: {
        arrival_date: arrival_date,
        task: { id: taskId, proof_status: 'proofed' },
      },
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error updating arrival_date or proof status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
