import { Hono } from 'hono';
import { getListHandler } from '@controllers/list.controller';

const list = new Hono();

/*
 * Base path: '/lists'
 */

list.get('/:id', ...getListHandler);

export default list;
