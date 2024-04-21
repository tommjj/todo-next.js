import NextAuth from 'next-auth';

declare interface UserSession {
    id: string;
    name: string;
    email: string;
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user?: UserSession;
    }
}
