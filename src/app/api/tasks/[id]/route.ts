import db from '@/lib/db';
import { TaskUpdateSchema } from '@/lib/zod.schema';
import { Prisma } from '@prisma/client';

export function GET() {
    return new Response('hello world!', { status: 200 });
}

export async function PATCH(req: Request) {
    const data = await req.json();
    const dataParse = TaskUpdateSchema.safeParse(data);

    if (dataParse.success) {
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
                id: dataParse.data.id,
            },
        });

        return new Response('', { status: 200 });
    }

    return new Response('', { status: 400 });
}
