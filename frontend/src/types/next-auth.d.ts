import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessToken: string;
      created_at: string;
      updated_at: string;
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    created_at: string;
    updated_at: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    created_at: string;
    updated_at: string;
  }
}
