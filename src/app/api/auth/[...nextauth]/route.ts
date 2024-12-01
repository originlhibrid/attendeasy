import NextAuth from 'next-auth';
import { authOptions } from '../auth.config';

// Extend the default session user type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    }
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
