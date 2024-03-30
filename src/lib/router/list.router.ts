import { Hono } from 'hono';
import { getListHandler } from '@controllers/list.controller';

const list = new Hono();

list.get('/:id', ...getListHandler);

export default list;
