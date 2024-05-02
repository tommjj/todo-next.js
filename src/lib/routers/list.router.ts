import { Hono } from 'hono';
import {
    getListHandler,
    getAllListsDetailsHandler,
} from '@controllers/list.controller';

const list = new Hono();

/*
 * Base path: '/lists'
 */

list.get('/', ...getAllListsDetailsHandler);

list.get('/:id', ...getListHandler);

export default list;
