'use client';

import { signOut, useSession as useNextAuthSession } from 'next-auth/react';

export function useSession() {
    const { data: session } = useNextAuthSession();

    const user = session?.user ?? {
        name: '',
        email: '',
        image: '',
    };

    const handleSignOut = () => signOut({ callbackUrl: '/login' });

    return { user, signOut: handleSignOut };
}
