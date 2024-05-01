import prisma from '@/lib/databases/prisma.init';
import { CreateTaskSchema } from '@/lib/zod.schema';
import { getSessionUser } from '@/lib/auth';
import { findListById } from '@/lib/services/list.service';
import { convertTime } from '@/lib/utils';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getSessionUser();
    if (!user) return new Response(undefined, { status: 401 });

    const [list, err] = await findListById({
        listId: params.id,
        userId: user.id,
    });

    if (list) return Response.json(list, { status: 200 });

    return Response.json({ message: err.message }, { status: 410 });
}

// TODO: change to path: tasks
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getSessionUser();
        if (!user) return new Response(undefined, { status: 401 });

        const [list] = await findListById(
            {
                listId: params.id,
                userId: user.id,
            },
            {
                id: true,
            }
        );

        if (!list) return new Response(undefined, { status: 401 });

        const body = await req.json();

        const bodyParse = CreateTaskSchema.safeParse(body);
        if (!bodyParse.success) return new Response(undefined, { status: 400 });

        const task = await prisma.task.create({
            data: {
                ...bodyParse.data,
                subTasks: undefined, //!
                dueDate: convertTime(bodyParse.data.dueDate),
                listId: params.id, //!
            },
        });

        return Response.json(task, { status: 200 });
    } catch (e) {
        return new Response(undefined, { status: 400 });
    }
}
