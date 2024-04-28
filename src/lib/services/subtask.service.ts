import { Prisma } from '@prisma/client';
import prisma from '../databases/prisma.init';

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

const createSubTask = (data: createSubTaskData) => {
    return prisma.subTask.create({ data: { ...data } });
};
