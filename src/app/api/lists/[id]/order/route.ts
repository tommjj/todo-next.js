import { getSessionUser } from '@/lib/auth';
import { findListById } from '@/lib/services/list.service';

export async function GET() {
    return new Response(undefined, { status: 204 });
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getSessionUser();
    if (!user) return new Response(undefined, { status: 401 });

    const [list] = await findListById(
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
