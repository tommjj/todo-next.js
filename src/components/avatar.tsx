'use client';

import { cn } from '@/lib/utils';

export const Avatar = ({
    name,
    className,
    ...props
}: {
    name: string;
} & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>) => {
    return (
        <div
            className={cn(
                'h-8 w-8 text-[0.8rem] font-semibold flex justify-center items-center border rounded-full mr-3 bg-[#00000020]',
                className
            )}
            {...props}
        >
            {name.substring(0, 2)}
        </div>
    );
};

export default Avatar;
