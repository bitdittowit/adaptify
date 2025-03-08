import { type NextRequest, NextResponse } from 'next/server';

import { getDefaultUser } from '@/constants/user';

export async function POST(request: NextRequest) {
    const { level } = await request.json();

    const user = await getDefaultUser();
    user.level = level;

    return NextResponse.json({ success: true, user });
}
