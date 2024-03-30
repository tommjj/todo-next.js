import { useAuth } from '@/lib/api.hook';
import prisma from '@/lib/databases/prisma.init';

export async function POST() {
    const [user, response] = await useAuth();
    if (response) return response;
}

export async function GET() {
    const [user, err] = await useAuth();
    if (err) return err;

    const lists = await prisma.list.findMany({
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
