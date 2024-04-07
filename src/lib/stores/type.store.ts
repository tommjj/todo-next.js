export interface Sync {
    sync: () => Promise<any>;
}

export interface DeleteWithCancel extends Sync {
    cancel: () => boolean;
}
