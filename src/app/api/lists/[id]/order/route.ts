import { getSessionUser } from '@/lib/auth';
import { getListById } from '@/lib/service';

export async function GET() {
    return new Response(undefined, { status: 204 });
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getSessionUser();
    if (!user) return new Response(undefined, { status: 401 });

    const [list] = await getListById(
        { listId: params.id, userId: user.id },
        {
            tasks: {
                select: {
                    id: true,
                    order: true,
                },
                orderBy: {
                    order: 'desc',
                },
            },
        }
    );
    if (!list?.tasks) return new Response(undefined, { status: 401 });

    const tasks = list.tasks;
    console.log(tasks);
    return new Response(undefined, { status: 204 });
}
