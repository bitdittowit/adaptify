import { getDefaultUser } from '@/app/constants/user';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(getDefaultUser());
}
