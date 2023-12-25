'use client';

import { getListById } from '@/lib/http';
import useStore from '@/store/store';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function FetchList(props: { id: string }) {
    const setList = useStore((state) => state.setList);
    const pathname = usePathname();

    useEffect(() => {
        getListById(props.id).then(([list]) => {
            if (list) setList(list);
        });
    }, [props, setList]);

    useEffect(
        () => () => {
            setList(null);
        },
        [pathname, setList]
    );

    return null;
}

export default FetchList;
