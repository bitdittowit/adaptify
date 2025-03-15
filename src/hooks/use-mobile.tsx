'use client';

import * as React from 'react';

export const BREAKPOINTS = {
    xs: 480, // Маленькие телефоны
    sm: 640, // Стандартные телефоны
    md: 768, // Большие телефоны/маленькие планшеты
    lg: 1024, // Планшеты
    xl: 1280, // Маленькие десктопы
};

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < BREAKPOINTS.md);
        };
        mql.addEventListener('change', onChange);
        setIsMobile(window.innerWidth < BREAKPOINTS.md);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    // Предотвращаем вывод false во время SSR
    if (typeof window === 'undefined') {
        return false;
    }

    return !!isMobile;
}

// Новый хук для более точного определения размера экрана
export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const updateBreakpoint = () => {
            const width = window.innerWidth;
            if (width < BREAKPOINTS.xs) {
                setBreakpoint('xs');
            } else if (width < BREAKPOINTS.sm) {
                setBreakpoint('sm');
            } else if (width < BREAKPOINTS.md) {
                setBreakpoint('md');
            } else if (width < BREAKPOINTS.lg) {
                setBreakpoint('lg');
            } else {
                setBreakpoint('xl');
            }
        };

        window.addEventListener('resize', updateBreakpoint);
        updateBreakpoint();

        return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);

    return breakpoint;
}
