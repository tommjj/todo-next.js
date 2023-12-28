'use client';

import { List } from '@/lib/zod.schema';
import useStore from '@/store/store';
import { useEffect } from 'react';

function SetList({ list }: { list: List }) {
    const setList = useStore((state) => state.setList);

    useEffect(() => {
        setList(list);
    });

    return null;
}

export default SetList;
