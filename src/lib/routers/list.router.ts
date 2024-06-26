import { Hono } from 'hono';
import {
    getListHandler,
    getAllListsDetailsHandler,
    deleteListHandler,
    createListHandler,
    updateListHandler,
    clearAllCompletedTaskInListHandler,
    updateOrderTaskInListHandler,
} from '@controllers/list.controller';

const lists = new Hono();

/*
 * Base path: '/lists'
 */

lists.get('/', ...getAllListsDetailsHandler);

lists.get('/:id', ...getListHandler);

lists.post('/', ...createListHandler);

lists.patch('/:id', ...updateListHandler);

lists.put('/:id/order', ...updateOrderTaskInListHandler);

lists.delete('/:id', ...deleteListHandler);

lists.delete('/:id/clear', ...clearAllCompletedTaskInListHandler);

export default lists;
