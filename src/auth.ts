import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';

import { authConfig } from '@/auth.config';
import { getUserByUsername } from './lib/service';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        username: z.string(),
                        password: z.string(),
                    })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;

                    const user = await getUserByUsername(username);

                    if (!user) return null;

                    if (await bcrypt.compare(password, user.password)) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.id,
                        };
                    }
                }
                return null;
            },
        }),
    ],
});
