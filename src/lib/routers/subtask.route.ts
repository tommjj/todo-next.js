import { Hono } from 'hono';
import {
    createSubTask,
    updateSubTask,
    deleteSubtask,
} from '@controllers/subtask.controller';

const subtasks = new Hono();

/*
 * Base path: '/subtasks'
 */

subtasks.get('/hello', async (c) => {
    return c.text('HELLO');
});

subtasks.patch('/:id', ...updateSubTask);

subtasks.delete('/:id', ...deleteSubtask);

subtasks.post('/', ...createSubTask);

export default subtasks;
