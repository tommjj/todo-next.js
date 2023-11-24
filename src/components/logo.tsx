'use client';

import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Logo() {
    return (
        <Link
            className="flex h-12 justify-center items-center w-32 text-3xl dark:text-white"
            href={'/'}
        >
            <ArrowsPointingOutIcon />
            <span className="font-semibold">LOGO</span>
        </Link>
    );
}
