'use client';

import clsx from 'clsx';
import Link from 'next/link';

interface Button extends React.ButtonHTMLAttributes<{}> {
    variant?:
        | ''
        | 'primary'
        | 'warning'
        | 'success'
        | 'secondary'
        | 'destructive'
        | 'outline'
        | 'ghost'
        | 'dark'
        | 'link';
    href?: string;
    roundedFull?: boolean;
    scroll?: boolean;
}

export default function Button({
    children,
    className,
    disabled = false,
    roundedFull = false,
    variant = '',

    ...props
}: Button) {
    className = `flex items-center justify-center py-2 cursor-pointer disabled:cursor-default hover:opacity-90 ${clsx(
        {
            'bg-[#18181B] dark:bg-[#FAFAFA] dark:text-[#18181B] text-[#FAFAFA]':
                variant === 'dark',
            'bg-[#0D6EFD] text-[#FAFAFA] dark:bg-[#0058dc]':
                variant === 'primary',
            'bg-[#198754] text-[#FAFAFA]': variant === 'success',
            'bg-[#F4F4F5] dark:bg-[#27272A] text-[#18181B] dark:text-[#FAFAFA]':
                variant === 'secondary',
            'bg-[#FFC107] text-[#FAFAFA]': variant === 'warning',
            'bg-[#DC2626] text-[#FAFAFA]': variant === 'destructive',
            'text-[#0D6EFD] underline ': variant === 'link',
            border: variant === 'outline',
            'hover:bg-[#09090920] dark:hover:bg-[#ffffff26] text-[#18181B] dark:text-[#FAFAFA]':
                variant === 'ghost',
            'rounded-full px-5': roundedFull,
            'rounded-md px-4': !roundedFull,
        }
    )} ${className}`;

    return (
        <>
            {props.href ? (
                <Link href={props.href} className={className} {...props}>
                    {children}
                </Link>
            ) : (
                <button className={className} {...props}>
                    {children}
                </button>
            )}
        </>
    );
}
