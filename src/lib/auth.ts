import { auth } from '@/auth';

export async function getSessionUser() {
    const session = await auth();

    const user = session?.user;

    if (!user) return undefined;

    const { name, email } = user;

    if (!(name && email)) return undefined;

    return { name, id: email };
}
