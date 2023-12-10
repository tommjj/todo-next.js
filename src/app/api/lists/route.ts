import { useAuth } from '@/lib/api.hook';
import db from '@/lib/db';

export async function POST() {
    const [user, response] = await useAuth();
    if (response) return response;
}

export async function GET() {
    const [user, err] = await useAuth();
    if (err) return err;

    const lists = await db.list.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    tasks: {
                        where: {
                            completed: true,
                        },
                    },
                },
            },
        },
        where: {
            user: {
                name: user,
            },
        },
    });

    return new Response(JSON.stringify({ data: { ...lists } }), {
        status: 200,
    });
}
