import { Hono } from 'hono';
import {
    getListHandler,
    getAllListsDetailsHandler,
    deleteListHandler,
    createListHandler,
    updateListHandler,
} from '@controllers/list.controller';

const list = new Hono();

/*
 * Base path: '/lists'
 */

list.get('/', ...getAllListsDetailsHandler);

list.get('/:id', ...getListHandler);

list.post('/', ...createListHandler);

list.patch('/:id', ...updateListHandler);

list.delete('/:id', ...deleteListHandler);

export default list;
