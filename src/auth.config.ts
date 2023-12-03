import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/sign-in',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            const isOnTasks = nextUrl.pathname.startsWith('/tasks');

            const isOnHomePage = nextUrl.pathname === '/';
            if (isOnHomePage) return true;

            if (isOnTasks && isLoggedIn) {
                return true;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/tasks', nextUrl));
            }
            return false;
        },
    },
} satisfies NextAuthConfig;
