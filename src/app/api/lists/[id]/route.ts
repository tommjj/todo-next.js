import { getList } from '@/lib/data';
import db from '@/lib/db/prisma.init';
import { CreateTaskSchema } from '@/lib/zod.schema';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const [list, err] = await getList(params.id);

    if (list) return Response.json(list, { status: 200 });

    return Response.json({ message: err.message }, { status: 410 });
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        //auth
        const [list] = await getList(params.id, {
            id: true,
            _count: { select: { tasks: true } },
        });
        if (!list) return new Response(undefined, { status: 401 });

        const body = await req.json();

        const bodyParse = CreateTaskSchema.safeParse(body);
        if (!bodyParse.success) return new Response(undefined, { status: 400 });

        const task = await db.task.create({
            data: {
                ...bodyParse.data,
                listId: params.id,
                order: list._count.tasks,
            },
        });

        return Response.json(task, { status: 200 });
    } catch (e) {
        return new Response(undefined, { status: 400 });
    }
}
