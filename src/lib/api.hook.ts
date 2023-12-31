import { auth } from '@/auth';

export async function useAuth(): Promise<
    [undefined, Response] | [string, undefined]
> {
    const user = await auth();

    if (user?.user?.name) {
        return [user?.user?.name, undefined];
    }
    return [
        undefined,
        new Response(JSON.stringify({ message: 'sign in' }), {
            status: 400,
        }),
    ];
}
