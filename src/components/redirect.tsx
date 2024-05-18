'use client';

import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';

const Redirect = ({ href }: { href: string }) => {
    useLayoutEffect(() => {
        redirect(href);
    }, [href]);

    return null;
};
export default Redirect;
