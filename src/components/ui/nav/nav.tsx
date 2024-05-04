'use client';

import Nav from './side-nav';
import useStore from '@/lib/stores/index.store';
import { useLayoutEffect } from 'react';

export default function SideNav() {
    const fetchLists = useStore((s) => s.fetchLists);

    useLayoutEffect(() => {
        fetchLists();
    }, [fetchLists]);

    return <Nav />;
}
