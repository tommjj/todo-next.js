'use client';

import { deleteListAction } from '@/lib/action';

function ToolBarTitle({ list }: { list: { name: string; id: string } }) {
    const deleteAction = deleteListAction.bind(null, list.id);

    return (
        <div className=" flex-grow">
            <div className="h-12 flex items-center px-2">
                <h1 className="font-semibold text-2xl tracking-tight mr-2 ">
                    {list.name}
                </h1>
            </div>
        </div>
    );
}

function ToolBarButton() {
    return <div className="flex pr-5 items-center"></div>;
}

function ToolBar({ list }: { list: { name: string; id: string } }) {
    return (
        <div className="w-full flex text-inherit dark:text-inherit">
            <ToolBarTitle list={list} />
            <ToolBarButton />
        </div>
    );
}

export default ToolBar;
