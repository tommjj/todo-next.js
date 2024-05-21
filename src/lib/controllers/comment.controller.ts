import { Factory } from 'hono/factory';
import { auth } from './middleware';
import { zValidator } from '@hono/zod-validator';
import prisma from '../databases/prisma.init';
import { z } from 'zod';

const factory = new Factory();

/*
 * @path:: /comments
 * @method:: POST
 */
// export const createComments =
