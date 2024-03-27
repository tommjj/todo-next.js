import { Prisma } from '@prisma/client';

export type Account = {
    username: string;
    email: string;
    password: string;
};

export type Lists = { id: string; name: string }[];

export type CreateTask =
    | (Prisma.Without<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput> &
          Prisma.TaskUncheckedCreateInput)
    | (Prisma.Without<Prisma.TaskUncheckedCreateInput, Prisma.TaskCreateInput> &
          Prisma.TaskCreateInput);
