import db from '../db/prisma.init';

export async function deleteList(listId: string) {
    try {
        await db.miniTask.deleteMany({
            where: {
                task: {
                    listId: listId,
                },
            },
        });

        await db.task.deleteMany({
            where: {
                listId: listId,
            },
        });

        await db.list.delete({
            where: {
                id: listId,
            },
        });
        return undefined;
    } catch (err) {
        return err as Error;
    }
}

export async function deleteTask(id: string) {
    try {
        await db.miniTask.deleteMany({
            where: {
                task: {
                    listId: id,
                },
            },
        });

        await db.task.delete({
            where: {
                id: id,
            },
        });
        return undefined;
    } catch (err) {
        return err as Error;
    }
}
