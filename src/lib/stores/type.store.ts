export interface Sync {
    sync: () => undefined | Promise<any>;
}

export interface DeleteWithCancel extends Sync {
    cancel: () => boolean;
}
