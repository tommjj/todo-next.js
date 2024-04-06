import { List, TaskUpdate, Task } from '@/lib/zod.schema';

export interface Sync {
    sync: () => Promise<any>;
}

export interface DeleteWithCancel extends Sync {
    cancel: () => boolean;
}
