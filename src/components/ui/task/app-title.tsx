'use client';

import useStore from '@/lib/stores/index.store';

function ListName({ name }: { name?: string }) {
    const listName = useStore((s) => s.currentList?.name);

    return (
        <div className=" flex-grow">
            <div className="h-12 flex items-center">
                <h1 className="font-semibold text-2xl tracking-tight mr-2 ">
                    {name || listName}
                </h1>
            </div>
        </div>
    );
}

function AppTitle({ name }: { name?: string }) {
    return (
        <div className="w-full flex text-inherit dark:text-inherit">
            <ListName name={name} />
        </div>
    );
}

export default AppTitle;
