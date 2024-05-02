import { Hono } from 'hono';
import {
    getListHandler,
    getAllListsDetailsHandler,
    deleteListHandler,
    createListHandler,
} from '@controllers/list.controller';

const list = new Hono();

/*
 * Base path: '/lists'
 */

list.get('/', ...getAllListsDetailsHandler);

list.get('/:id', ...getListHandler);

list.post('/', ...createListHandler);

list.delete('/:id', ...deleteListHandler);

export default list;
