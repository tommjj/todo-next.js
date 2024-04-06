'use client';

import { getListById } from '@/lib/http';
import useStore from '@/lib/stores/index.store';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function FetchList(props: { id: string }) {
    const setList = useStore((state) => state.setList);
    const { board } = useParams();

    useEffect(() => {
        getListById(props.id).then(([list]) => {
            if (list) setList(list);
        });
    }, [props, setList]);

    useEffect(
        () => () => {
            setList(null);
        },
        [board, setList]
    );

    return null;
}

export default FetchList;
