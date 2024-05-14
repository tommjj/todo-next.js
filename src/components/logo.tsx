'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    return (
        <Link
            className="flex h-10 md:h-12 justify-center items-center text-3xl dark:text-white"
            href={'/'}
            scroll={false}
        >
            <Image
                priority
                className="h-10 w-10 md:h-11 md:w-11 mr-2 rounded-full"
                src="/images/TODO_LOGO.png"
                alt="logo"
                width={44}
                height={44}
            />
            {/* <span className="font-semibold">LOGO</span> */}
        </Link>
    );
}
