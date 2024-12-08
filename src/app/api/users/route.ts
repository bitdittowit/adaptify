import { getDefaultUser } from '@/app/constants/user';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getDefaultUser();
  return NextResponse.json(user);
}
