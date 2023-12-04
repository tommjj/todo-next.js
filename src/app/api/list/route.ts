import { auth } from '@/auth';
import { useAuth } from '@/lib/api.hook';
import db from '@/lib/db';

export async function POST() {
    const [user, response] = await useAuth();
    if (response) return response;
}

export async function GET() {
    const [user, response] = await useAuth();
    if (response) return response;

    const list = await db.list.findMany({
        select: {
            id: true,
            name: true,
        },
        where: {
            user: {
                name: user,
            },
        },
    });

    return new Response(JSON.stringify(list), {
        status: 200,
    });
}
