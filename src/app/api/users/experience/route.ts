import { NextRequest, NextResponse } from 'next/server';
import { getDefaultUser } from '@/app/constants/user';

export async function POST(request: NextRequest) {
  const { experience } = await request.json();

  const user = await getDefaultUser();
  user.experience = Number(user.experience) + Number(experience);
  user.level = Math.round(Number(user.experience) / 200);

  return NextResponse.json({ success: true, user });
}
