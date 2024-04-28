import { Prisma } from '@prisma/client';
import prisma from '../databases/prisma.init';
import { withError } from '../utils';

/*
 * ----==== CREATE ====----
 */

type createSubTaskData =
    | (Prisma.Without<
          Prisma.SubTaskCreateInput,
          Prisma.SubTaskUncheckedCreateInput
      > &
          Prisma.SubTaskUncheckedCreateInput)
    | (Prisma.Without<
          Prisma.SubTaskUncheckedCreateInput,
          Prisma.SubTaskCreateInput
      > &
          Prisma.SubTaskCreateInput);

export const createSubTask = async (data: createSubTaskData) => {
    const func = withError(prisma.subTask.create);

    return await func({ data });
};
