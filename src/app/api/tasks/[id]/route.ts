import db from '@/lib/db';
import { TaskUpdateSchema } from '@/lib/zod.schema';
import { Prisma } from '@prisma/client';

export function GET() {
    return new Response('hello world!', { status: 200 });
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const data = await req.json();
    const dataParse = TaskUpdateSchema.safeParse(data);

    if (dataParse.success) {
        const miniTasks = dataParse.data.miniTasks;
        delete dataParse.data.miniTasks;

        const updateData = dataParse.data as Prisma.XOR<
            Prisma.TaskUpdateInput,
            Prisma.TaskUncheckedUpdateInput
        >;

        await db.task.update({
            data: {
                ...updateData,
            },
            where: {
                id: params.id,
            },
        });

        return new Response('', { status: 200 });
    }

    return new Response('', { status: 400 });
}
