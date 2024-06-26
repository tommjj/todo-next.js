import { useMemo, useState } from 'react';
import { Days, Months, cn, getDateOffset } from '@/lib/utils';
import { BsCalendar } from 'react-icons/bs';

export const DateTitle = ({
    date,
    withIcon = false,
    className,
    iconClassName,
}: {
    date: Date;
    withIcon?: boolean;
    className?: string;
    iconClassName?: string;
}) => {
    const [now] = useState(new Date());

    const offset = useMemo(() => getDateOffset(now, date), [date, now]);

    const dateString = useMemo(() => {
        if (offset < -1 || offset > 7)
            return `${date.getDate()} ${Months[date.getMonth()]}${
                now.getFullYear() === date.getFullYear()
                    ? ``
                    : ` ${date.getFullYear()}`
            }`;
        if (offset === -1) return 'Yesterday';
        if (offset === 0) return 'Today';
        if (offset === 1) return 'Tomorrow';
        return Days[date.getDay()];
    }, [date, now, offset]);

    return (
        <span
            className={cn(
                {
                    'text-red-600': offset < 0,
                    'text-green-600': offset === 0,
                    'text-amber-600': offset === 1,
                    'text-indigo-600': offset && 1 < offset && offset < 7,
                },
                className
            )}
        >
            {withIcon && <BsCalendar className={iconClassName}></BsCalendar>}
            {dateString}
        </span>
    );
};
