import { Hono } from 'hono';
import {
    getListHandler,
    getAllListsDetailsHandler,
    deleteListHandler,
    createListHandler,
    updateListHandler,
} from '@controllers/list.controller';

const lists = new Hono();

/*
 * Base path: '/lists'
 */

lists.get('/', ...getAllListsDetailsHandler);

lists.get('/:id', ...getListHandler);

lists.post('/', ...createListHandler);

lists.patch('/:id', ...updateListHandler);

lists.delete('/:id', ...deleteListHandler);

export default lists;
