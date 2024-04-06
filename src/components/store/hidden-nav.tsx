'use client';

import useStore from '@/lib/stores/index.store';
import { useEffect } from 'react';

function HiddenNav() {
    const handleCloseNav = useStore((state) => state.handleCloseNav);
    const handleOpenNav = useStore((state) => state.handleOpenNav);

    useEffect(() => {
        handleCloseNav();

        return () => {
            handleOpenNav();
        };
    });

    return null;
}

export default HiddenNav;
