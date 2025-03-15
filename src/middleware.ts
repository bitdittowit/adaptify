import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isOnboarding = req.nextUrl.pathname === '/onboarding';
        const hasCountry = Boolean(token?.country);
        const hasStudyGroup = Boolean(token?.study_group);
        const needsOnboarding = !(hasCountry && hasStudyGroup);

        if (needsOnboarding && !isOnboarding) {
            return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        return NextResponse.next();
    },
    {
        pages: {
            signIn: '/login',
        },
    },
);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|onboarding).*)'],
};
