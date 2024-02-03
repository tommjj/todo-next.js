import { getList } from '@/lib/data';

export async function GET() {
    return new Response(undefined, { status: 204 });
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const [list] = await getList(params.id, {
        tasks: {
            select: {
                id: true,
                order: true,
            },
            orderBy: {
                order: 'desc',
            },
        },
    });
    if (!list?.tasks) return new Response(undefined, { status: 401 });

    const tasks = list.tasks;
    console.log(tasks);
    return new Response(undefined, { status: 204 });
}
