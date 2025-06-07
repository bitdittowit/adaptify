'use client';

import { Session } from 'next-auth';
import { signOut, useSession as useNextAuthSession } from 'next-auth/react';
import { Role } from '@/types';

// Extended session type to include our custom properties
export type ExtendedSession = Session & {
  user: {
    id?: number;
    name?: string;
    email?: string;
    image?: string;
    country?: string;
    study_group?: string;
    sex?: string;
    experience?: number;
    level?: number;
    role?: Role;
  }
}

export function useSession() {
    const { data: session } = useNextAuthSession();
    
    // Cast session to our extended type
    const extendedSession = session as ExtendedSession | null;

    const user = extendedSession?.user ?? {
        name: '',
        email: '',
        image: '',
        id: undefined,
        country: undefined,
        study_group: undefined,
        sex: undefined,
        experience: undefined,
        level: undefined,
        role: undefined as Role | undefined,
    };

    const handleSignOut = () => signOut({ callbackUrl: '/login' });

    return { user, signOut: handleSignOut };
}
