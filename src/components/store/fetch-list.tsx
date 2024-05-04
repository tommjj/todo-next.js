'use client';

import { getListById } from '@/lib/http';
import useStore from '@/lib/stores/index.store';
import { useParams } from 'next/navigation';
import { useLayoutEffect } from 'react';

function FetchList(props: { id: string }) {
    const setList = useStore((state) => state.setList);
    const { board } = useParams();

    useLayoutEffect(() => {
        getListById(props.id).then(([list, err]) => {
            if (list) setList(list);
        });
    }, [props.id, setList]);

    useLayoutEffect(
        () => () => {
            setList(null);
        },
        [board, setList]
    );

    return null;
}

export default FetchList;
