import { NextResponse } from 'next/server';
import { getDefaultUser } from '@/app/constants/user';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getDefaultUser();
  
  const { id } = params;

  const task = user.tasks.find((task) => task.id === parseInt(id));

  if (!task) {
    return NextResponse.json(
      { error: `No task with id ${id}` },
      { status: 404 },
    );
  }

  return NextResponse.json(task);
}
