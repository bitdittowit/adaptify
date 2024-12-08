import { getDefaultUser } from '@/app/constants/user';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getDefaultUser();

  const totalExperience = user.tasks.reduce(
    (total, task) => total + task.experience_points, 0);

  return NextResponse.json({
    level: user.level,
    experience: user.experience,
    totalExperience,
  });
}
