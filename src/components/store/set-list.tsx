'use client';

import { ListWithTasks } from '@/lib/definitions';
import useStore from '@/store/store';
import { useEffect, useRef } from 'react';

function SetList({ list }: { list: ListWithTasks }) {
    const ref = useRef(true);
    const setList = useStore((state) => state.setList);

    useEffect(() => {
        if (ref.current) setList(list);
        ref.current = false;
    });

    return null;
}

export default SetList;
