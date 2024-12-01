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

// Add error handling wrapper
async function handleAuth(req: Request, context: { params: { nextauth: string[] } }) {
  try {
    // Log the request for debugging
    console.log('Auth request:', {
      method: req.method,
      url: req.url,
      nextauth: context.params.nextauth
    });

    const response = await handler(req, context);
    return response;
  } catch (error) {
    console.error('NextAuth error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Authentication error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export { handleAuth as GET, handleAuth as POST };
