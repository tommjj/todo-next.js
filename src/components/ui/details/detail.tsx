'use client';

import useStore from '@/store/store';

export default function DetailsContainer({ id }: { id: string }) {
    const list = useStore((state) => state.list);

    const task = list && list.tasks?.find((e) => e.id === id);

    console.log(task);

    return <>{task && <div>{JSON.stringify(task)}</div>}</>;
}
