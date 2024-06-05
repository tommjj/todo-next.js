import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/sign-in',
        newUser: '/sign-up',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            const isOnTasks = nextUrl.pathname.startsWith('/tasks');
            const isOnShare = nextUrl.pathname.startsWith('/share');
            const isOnHomePage = nextUrl.pathname === '/';

            if (isOnHomePage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/tasks', nextUrl));
                }
                return true;
            }

            if (isOnTasks || isOnShare) {
                if (isLoggedIn) {
                    return true;
                }
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/tasks', nextUrl));
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
