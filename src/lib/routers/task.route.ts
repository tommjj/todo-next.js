import { Hono } from 'hono';
import * as c from '@controllers/task.controller';

const task = new Hono();

task.get('/search/:q', ...c.searchTasksHandler);

task.get('/important', ...c.getAllImportantTaskHandler);

task.get('/planned', ...c.getAllPlannedTaskHandler);

task.post('/', ...c.createTaskHandler);

task.patch('/:id', ...c.updateTaskHandler);

task.delete('/:id', ...c.deleteTaskHandler);

export default task;
