'use client';

import { CiCalendar } from 'react-icons/ci';
import Button from '../button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRef,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import { buttonProps } from '../nav/nav-buttons';
import {
    BsCalendar,
    BsCalendar3,
    BsCalendar3Event,
    BsCalendar3Week,
} from 'react-icons/bs';
import { MdDoNotDisturbAlt } from 'react-icons/md';
import { Calendar } from '@/components/ui-lib/ui/calendar';
import { cn, getYesterday } from '@/lib/utils';
import { useCallback, useMemo, useRef, useState } from 'react';
import { LiaTimesSolid } from 'react-icons/lia';
import { DateTitle } from '../date';

export const DueDatePicker = ({
    defaultValue,
    onChanged = () => {},
    className,
}: {
    className?: string;
    defaultValue?: Date;
    onChanged?: (date: Date | null) => void;
}) => {
    const dropDownMenuRef = useRef<DropdownMenuRef>(null);
    const [selectedDay, setSelectedDay] = useState(defaultValue);

    const handleSelectDay = useCallback(
        (d: Date | undefined) => {
            setSelectedDay(d);
            onChanged(d || null);
            dropDownMenuRef.current?.handleClose();
        },
        [onChanged]
    );

    const handleSetToday = useCallback(() => {
        const now = new Date();
        now.setMilliseconds(0);
        now.setSeconds(0);
        now.setHours(0);

        handleSelectDay(now);
    }, [handleSelectDay]);

    const handleSetTomorrow = useCallback(() => {
        const now = new Date();
        now.setMilliseconds(0);
        now.setSeconds(0);
        now.setHours(0);
        now.setDate(now.getDate() + 1);

        handleSelectDay(now);
    }, [handleSelectDay]);

    const handleSetNextWeak = useCallback(() => {
        const now = new Date();
        now.setMilliseconds(0);
        now.setSeconds(0);
        now.setHours(0);
        now.setDate(now.getDate() + (8 - now.getDay()));

        handleSelectDay(now);
    }, [handleSelectDay]);

    const handleSetNextMonth = useCallback(() => {
        const now = new Date();
        now.setMilliseconds(1);
        now.setSeconds(0);
        now.setHours(0);
        now.setDate(0);
        now.setMonth(now.getMonth() + 1);

        handleSelectDay(now);
    }, [handleSelectDay]);

    const handleNoDay = useCallback(() => {
        handleSelectDay(undefined);
    }, [handleSelectDay]);

    return (
        <DropdownMenu ref={dropDownMenuRef}>
            <DropdownMenuTrigger>
                <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                        'text-[0.8rem] leading-4 px-2 py-[5px] font-light border',

                        className
                    )}
                >
                    <CiCalendar className="w-4 h-4 mr-1 opacity-80" />
                    {selectedDay ? (
                        <DateTitle date={selectedDay} />
                    ) : (
                        `Due date`
                    )}

                    {selectedDay ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNoDay();
                            }}
                            className="w-4 h-4 p-[1px] ml-1 hover:bg-[#00000020] rounded-sm text-[#666] dark:text-[#e2e2e2]"
                        >
                            <LiaTimesSolid />
                        </div>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-[242px] rounded overflow-hidden bg-main-bg-color dark:bg-main-bg-color-dark"
                >
                    <div className="border-b p-2 px-3">
                        <input
                            className="w-full outline-none placeholder:font-light text-[0.9rem] bg-inherit font-light"
                            placeholder="Type a due day"
                            name="task name"
                            type="text"
                            autoComplete="off"
                            autoCapitalize="off"
                            defaultValue={
                                selectedDay ? selectedDay.toDateString() : ''
                            }
                        />
                    </div>
                    <div className="px-1 py-[6px] border-b ">
                        <Button
                            {...buttonProps}
                            type="button"
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                            onClick={handleSetToday}
                        >
                            <BsCalendar className="w-5 h-5 p-[1px] mr-2 text-green-600" />
                            Today
                        </Button>
                        <Button
                            {...buttonProps}
                            type="button"
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                            onClick={handleSetTomorrow}
                        >
                            <BsCalendar3Event className="w-5 h-5 p-[1px] mr-2 text-amber-600" />
                            Tomorrow
                        </Button>
                        <Button
                            {...buttonProps}
                            type="button"
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                            onClick={handleSetNextWeak}
                        >
                            <BsCalendar3Week className="w-5 h-5 p-[1px] mr-2 text-blue-600" />
                            Next week
                        </Button>
                        <Button
                            {...buttonProps}
                            type="button"
                            className={cn(
                                buttonProps.className,
                                'text-[0.8rem] font-normal opacity-80'
                            )}
                            onClick={handleSetNextMonth}
                        >
                            <BsCalendar3 className="w-5 h-5 p-[1px] mr-2 text-indigo-600" />
                            Next month
                        </Button>
                        {selectedDay ? (
                            <Button
                                {...buttonProps}
                                type="button"
                                className={cn(
                                    buttonProps.className,
                                    'text-[0.8rem] font-normal opacity-80'
                                )}
                                onClick={handleNoDay}
                            >
                                <MdDoNotDisturbAlt className="w-5 h-5 mr-2 opacity-70" />
                                No day
                            </Button>
                        ) : null}
                    </div>
                    <div className="flex justify-center w-full p-2">
                        <Calendar
                            fromMonth={getYesterday()}
                            disabled={(day) => day < getYesterday()}
                            mode="single"
                            className=""
                            selected={selectedDay}
                            onSelect={handleSelectDay}
                            weekStartsOn={1}
                        />
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
