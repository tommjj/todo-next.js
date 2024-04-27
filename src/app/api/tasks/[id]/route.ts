import prisma from '@/lib/databases/prisma.init';
import { getSessionUser } from '@/lib/auth';
import { deleteTask, getTaskById } from '@/lib/services/task.service';
import { TaskUpdateSchema } from '@/lib/zod.schema';
import { Prisma } from '@prisma/client';
import { convertTime } from '@/lib/utils';

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getSessionUser();
    if (!user) return new Response('', { status: 400 });

    const data = await req.json();
    const dataParse = TaskUpdateSchema.safeParse(data);

    if (dataParse.success) {
        const subTasks = dataParse.data.subTasks;
        delete dataParse.data.subTasks;

        const updateData = dataParse.data as Prisma.XOR<
            Prisma.TaskUpdateInput,
            Prisma.TaskUncheckedUpdateInput
        >;

        await prisma.task.update({
            data: {
                ...updateData,
                dueDate: convertTime(dataParse.data.dueDate),
            },
            where: {
                id: params.id,
                list: {
                    userId: user.id,
                },
            },
        });

        return new Response('', { status: 200 });
    }

    return new Response('', { status: 400 });
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getSessionUser();
    if (!user) return new Response(undefined, { status: 401 });

    const [task] = await getTaskById(
        { taskId: params.id, userId: user.id },
        { id: true }
    );

    if (!task) return new Response(undefined, { status: 401 });

    const err = await deleteTask(params.id);

    if (err) return new Response(undefined, { status: 410 });
    return new Response(undefined, { status: 204 });
}
