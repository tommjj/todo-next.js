'use client';

import {
    BsArrowRepeat,
    BsCalendar,
    BsCalendar3,
    BsCalendar3Event,
    BsCalendar3Week,
} from 'react-icons/bs';
import Button from '../button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import { buttonActiveClassName, buttonProps } from '../nav/nav-buttons';
import { cn } from '@/lib/utils';
import { $Enums } from '@prisma/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LiaTimesSolid } from 'react-icons/lia';

type RepeatPickerDataType = {
    label: string;
    triggerLabel: string;
    icon: React.ReactElement;
};

export type RepeatStateType = {
    repeat: $Enums.RepeatInterval;
    repeatCount: number;
};

const RepeatPickerData: {
    [K in $Enums.RepeatInterval]: RepeatPickerDataType;
} = {
    NONE: {
        label: 'None',
        triggerLabel: 'Repeat',
        icon: <BsArrowRepeat className="w-full h-full opacity-80" />,
    },
    DAILY: {
        label: 'Every day',
        triggerLabel: 'D',
        icon: (
            <BsCalendar3Event className="w-full h-full p-[1px] mr-2 text-amber-600" />
        ),
    },
    WEEKLY: {
        label: 'Every weak',
        triggerLabel: 'W',
        icon: (
            <BsCalendar3Week className="w-full h-full p-[1px] mr-2 text-blue-600" />
        ),
    },
    MONTHLY: {
        label: 'Every month',
        triggerLabel: 'M',
        icon: (
            <BsCalendar3 className="w-full h-full p-[1px] mr-2 text-blue-600" />
        ),
    },
    YEARLY: {
        label: 'Every year',
        triggerLabel: 'Y',
        icon: (
            <div className="w-full h-full mr-2 relative text-indigo-600">
                <BsCalendar className=" w-10/12 h-10/12 pl-[2px] pb-[2px] absolute top-[1px] right-[1px]" />
                <BsCalendar className=" w-10/12 h-10/12 pr-[2px] pt-[2px] absolute left-[1px] bottom-[1px]" />
            </div>
        ),
    },
};

const defaultState: RepeatStateType = { repeat: 'NONE', repeatCount: 0 };

export const RepeatPicker = ({
    className,
    onChanged = () => {},
    defaultValue = defaultState,
}: {
    className?: string;
    defaultValue?: RepeatStateType;
    onChanged?: (state: RepeatStateType) => void;
}) => {
    const [repeatState, setRepeatState] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChanged = useCallback(
        (r: RepeatStateType) => {
            onChanged(r);
            setRepeatState(r);
        },
        [onChanged]
    );

    const handReset: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            e.stopPropagation();
            handleChanged(defaultState);
        },
        [handleChanged]
    );

    return (
        <DropdownMenu
            onOpen={() => {
                setTimeout(() => {
                    inputRef.current?.focus();
                });
            }}
            onClose={() => {
                handleChanged({
                    ...repeatState,
                    repeatCount: Number(inputRef.current?.value || 0),
                });
            }}
        >
            <DropdownMenuTrigger>
                <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                        'text-[0.8rem] leading-4 px-2 py-[5px] font-light border',
                        className
                    )}
                >
                    <div className="w-4 h-4 mr-1 opacity-80">
                        {RepeatPickerData[repeatState.repeat].icon}
                    </div>
                    {RepeatPickerData[repeatState.repeat].triggerLabel}
                    {repeatState.repeatCount ? (
                        <div className="ml-1">{repeatState.repeatCount}</div>
                    ) : null}
                    {repeatState.repeat !== defaultState.repeat ? (
                        <div
                            onClick={handReset}
                            className="w-4 h-4 p-[1px] ml-1 hover:bg-[#00000020] rounded-sm"
                        >
                            <LiaTimesSolid />
                        </div>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="w-[200px] bg-main-bg-color dark:bg-main-bg-color-dark">
                    <div className="border-b p-2">
                        <input
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.preventDefault();
                            }}
                            ref={inputRef}
                            className="w-full outline-none placeholder:font-light text-[0.9rem] bg-inherit font-light"
                            placeholder="Type repeat count"
                            name="task name"
                            type="number"
                            min={0}
                            autoComplete="off"
                            autoCapitalize="off"
                        />
                    </div>
                    <ul className="py-2 px-1">
                        {Object.entries(RepeatPickerData).map(
                            ([key, value]) => {
                                return (key as $Enums.RepeatInterval) ===
                                    defaultState.repeat ? null : (
                                    <li key={key}>
                                        <Button
                                            {...buttonProps}
                                            type="button"
                                            className={cn(
                                                buttonProps.className,
                                                'text-[0.8rem] font-normal opacity-80',
                                                {
                                                    [buttonActiveClassName]:
                                                        (key as $Enums.RepeatInterval) ===
                                                        repeatState.repeat,
                                                }
                                            )}
                                            onClick={() => {
                                                handleChanged({
                                                    repeat: key as $Enums.RepeatInterval,
                                                    repeatCount: Number(
                                                        inputRef.current
                                                            ?.value || 0
                                                    ),
                                                });
                                            }}
                                        >
                                            <span className="block w-5 h-5 mr-2 ">
                                                {value.icon}
                                            </span>
                                            {value.label}
                                        </Button>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
