import { NextResponse } from 'next/server';
import { getDefaultUser } from '@/app/constants/user';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const user = await getDefaultUser();

  const { date } = (await params);

  const tasksOnDate = user.tasks.filter((task) =>
      new Date(task.picked_date).getDate() === new Date(date).getDate());

  if (tasksOnDate.length === 0) {
    return NextResponse.json(
      { error: 'No tasks found for given date' },
      { status: 404 },
    );
  }

  return NextResponse.json(tasksOnDate);
}
