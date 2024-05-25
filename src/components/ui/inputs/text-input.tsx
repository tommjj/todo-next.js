'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export const TaskNameInput = ({
    className,
    onEnter,
    ...props
}: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
> & { onEnter?: () => void }) => {
    return (
        <textarea
            onInput={(ev) => {
                const el = ev.target as HTMLTextAreaElement;

                el.style.height = '5px';
                el.style.height = el.scrollHeight + 'px';
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();

                    if (onEnter) {
                        onEnter();
                    }
                }
            }}
            className={cn(
                'w-full overflow-hidden h-max resize-none outline-none placeholder:font-medium text-[0.95rem] bg-inherit',
                className
            )}
            placeholder="Task name"
            name="task name"
            autoComplete="off"
            autoCapitalize="off"
            rows={1}
            {...props}
        />
    );
};

export const DescriptionInput = ({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>) => {
    return (
        <textarea
            onInput={(ev) => {
                const el = ev.target as HTMLTextAreaElement;

                el.style.height = '5px';
                el.style.height = el.scrollHeight + 'px';
            }}
            className={cn(
                'w-full overflow-hidden h-max text-[0.8rem] outline-none font-light placeholder:font-light resize-none bg-inherit',
                className
            )}
            placeholder="Description"
            name="description"
            autoComplete="off"
            autoCapitalize="off"
            rows={1}
            {...props}
        />
    );
};

type AreaInputPropsType = React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
> & { onEnter?: () => void };

export const AreaInput = forwardRef<HTMLTextAreaElement, AreaInputPropsType>(
    function AreaInput({ className, onEnter, ...props }, ref) {
        return (
            <textarea
                ref={ref}
                onInput={(ev) => {
                    const el = ev.target as HTMLTextAreaElement;

                    el.style.height = '5px';
                    el.style.height = el.scrollHeight + 'px';
                }}
                className={cn(
                    'w-full overflow-hidden h-max resize-none outline-none bg-inherit',
                    className
                )}
                autoComplete="off"
                autoCapitalize="off"
                rows={1}
                {...props}
            />
        );
    }
);
