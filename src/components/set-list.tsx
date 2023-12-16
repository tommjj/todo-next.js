'use client';

import { ListWithTasks } from '@/lib/definitions';
import useStore from '@/store/store';
import { useEffect } from 'react';

function SetList({ list }: { list: ListWithTasks }) {
    const setList = useStore((state) => state.setList);

    useEffect(() => {
        setList(list);
    });

    return null;
}

export default SetList;
