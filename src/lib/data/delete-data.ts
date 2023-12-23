import db from '../db';

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
