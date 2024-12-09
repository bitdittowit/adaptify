import { NextRequest, NextResponse } from 'next/server';
import { getDefaultUser } from '@/app/constants/user';
import { Status } from '@/types';

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  const user = await getDefaultUser();

  const task = user.tasks.find((task) => task.id == id);

  if (!task) {
    throw new Error(`No task with id ${id}`);
  }

  task.status = Status.FINISHED;
  user.experience = Number(user.experience) + Number(task.experience_points);
  user.level = Math.round(Number(user.experience) / 200);

  return NextResponse.json({ success: true, user });
}
