import 'next-auth';

declare module 'next-auth' {
    interface User {
        id?: number;
        country?: string;
        study_group?: string;
        sex?: string;
        experience?: number;
        level?: number;
    }

    interface Session {
        user: User;
    }
}
