import { Hono } from 'hono';
import {
    createTaskHandler,
    getAllImportantTaskHandler,
    getAllPlannedTaskHandler,
    searchTasksHandler,
} from '@controllers/task.controller';

const task = new Hono();

task.get('/search/:q', ...searchTasksHandler);

task.get('/important', ...getAllImportantTaskHandler);

task.get('/planned', ...getAllPlannedTaskHandler);

task.post('/', ...createTaskHandler);

export default task;
