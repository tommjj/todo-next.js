'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

const buttonVariant = {
    ghost: 'md:hover:bg-[#09090912] dark:hover:bg-[#ffffff26] text-[#18181B] dark:text-[#FAFAFA]',
    primary: 'bg-primary-color text-[#FAFAFA] dark:bg-primary-color',
    warning: 'bg-[#FFC107] text-[#FAFAFA]',
    success: 'bg-[#198754] text-[#FAFAFA]',
    secondary:
        'bg-[#F4F4F5] dark:bg-[#27272A] text-[#18181B] dark:text-[#FAFAFA]',
    destructive: 'bg-[#DC2626] text-[#FAFAFA]',
    outline: 'border opacity-95',
    dark: 'bg-[#18181B] dark:bg-[#FAFAFA] dark:text-[#18181B] text-[#FAFAFA]',
    link: 'text-[#0D6EFD] underline',
};

export type Variant = keyof typeof buttonVariant;

export interface ButtonProps extends React.ButtonHTMLAttributes<{}> {
    variant?: Variant;
    href?: string;
    roundedFull?: boolean;
    scroll?: boolean;
}

export default function Button({
    children,
    className,
    disabled = false,
    roundedFull = false,
    variant = 'dark',
    ...props
}: ButtonProps) {
    let Comp: any = props.href ? Link : 'button';

    const ClassName = cn(
        'flex items-center justify-center py-1 cursor-pointer disabled:cursor-default hover:opacity-90 overflow-hidden',
        buttonVariant[variant],
        {
            'rounded-full px-5': roundedFull,
            'rounded px-4': !roundedFull,
        },
        className
    );

    return (
        <Comp className={ClassName} {...props}>
            {children}
        </Comp>
    );
}
