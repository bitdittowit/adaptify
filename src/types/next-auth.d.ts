import 'next-auth';
import 'next-auth/jwt';

import { Role } from './';

declare module 'next-auth' {
  interface User {
    id?: number;
    country?: string;
    study_group?: string;
    sex?: string;
    experience?: number;
    level?: number;
    role?: Role;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number;
    country?: string;
    study_group?: string;
    sex?: string;
    experience?: number;
    level?: number;
    role?: Role;
  }
}
