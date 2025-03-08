import { NextResponse } from 'next/server';

import { getDefaultUser } from '@/constants/user';

export async function GET() {
    const user = await getDefaultUser();
    return NextResponse.json(user);
}
