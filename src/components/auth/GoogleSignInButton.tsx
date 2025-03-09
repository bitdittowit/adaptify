'use client';

import type { MouseEvent, ReactNode } from 'react';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

interface GoogleSignInButtonProps {
    children: ReactNode;
}

export function GoogleSignInButton({ children }: GoogleSignInButtonProps) {
    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <Button className="w-full" onClick={handleClick} type="button">
            {children}
        </Button>
    );
}
