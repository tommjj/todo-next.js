import { Hono } from 'hono';
import {
    createSubTask,
    updateSubTask,
    deleteSubtask,
} from '@controllers/subtask.controller';

const subtask = new Hono();

/*
 * Base path: '/subtask'
 */

subtask.get('/hello', async (c) => {
    return c.text('HELLO');
});

subtask.patch('/:id', ...updateSubTask);

subtask.delete('/:id', ...deleteSubtask);

subtask.post('/', ...createSubTask);

export default subtask;
