import { auth } from '@/auth';
import db from '@/lib/db';

export async function POST() {
    const user = await auth();
    if (!user?.user?.name) {
        return new Response(JSON.stringify({ message: 'sign in' }), {
            status: 400,
        });
    }
}

export async function GET() {
    const user = await auth();
    if (!user?.user?.name) {
        return new Response(JSON.stringify({ message: 'sign in' }), {
            status: 400,
        });
    }

    const list = await db.list.findMany({
        select: {
            id: true,
            name: true,
        },
        where: {
            user: {
                name: user.user?.name,
            },
        },
    });

    return new Response(JSON.stringify(list), {
        status: 200,
    });
}
