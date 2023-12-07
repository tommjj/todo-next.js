import { PrismaClient } from '@prisma/client';

const logs = { log: ['query', 'info'] }

const db = new PrismaClient();

export default db;
