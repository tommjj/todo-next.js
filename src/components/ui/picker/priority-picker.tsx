'use client';

import { $Enums } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import Button from '../button';
import { CiFlag1 } from 'react-icons/ci';
import { buttonActiveClassName, buttonProps } from '../nav/nav-buttons';
import { cn } from '@/lib/utils';
import { BsFlag, BsFlagFill } from 'react-icons/bs';

type PriorityPickerDataType = {
    label: string;
    triggerLabel: string;
    icon: React.ReactElement;
};

const PriorityPickerData: { [K in $Enums.Priority]: PriorityPickerDataType } = {
    PRIORITY1: {
        label: 'Priority 1',
        triggerLabel: 'P1',
        icon: <BsFlagFill className=" text-red-600" />,
    },
    PRIORITY2: {
        label: 'Priority 2',
        triggerLabel: 'P2',
        icon: <BsFlagFill className=" text-amber-600" />,
    },
    PRIORITY3: {
        label: 'Priority 3',
        triggerLabel: 'P3',
        icon: <BsFlagFill className=" text-blue-600" />,
    },
    PRIORITY4: {
        label: 'Priority 4',
        triggerLabel: 'Priority',
        icon: <BsFlag className="" />,
    },
};

export const PriorityPicker = ({
    defaultState = 'PRIORITY4',
    onChanged = () => {},
}: {
    defaultState?: $Enums.Priority;
    onChanged?: (priority: $Enums.Priority) => void;
}) => {
    const [priority, setPriority] = useState(defaultState);

    const handleSetPriority = useCallback(
        (priority: $Enums.Priority) => {
            setPriority(priority);
            onChanged(priority);
        },
        [onChanged]
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-[0.8rem] leading-4 px-2 py-[5px] font-light border"
                    onClick={(e) => {
                        console.log('2');
                    }}
                >
                    <div className="w-4 h-4 pt-[2px] mr-1">
                        {PriorityPickerData[priority].icon}
                    </div>
                    {PriorityPickerData[priority].triggerLabel}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="w-32 px-1 py-2">
                    <ul>
                        {Object.entries(PriorityPickerData).map(
                            ([key, value]) => (
                                <li key={key}>
                                    <Button
                                        {...buttonProps}
                                        type="button"
                                        className={cn(
                                            buttonProps.className,
                                            'text-[0.8rem] font-normal opacity-80',
                                            {
                                                [buttonActiveClassName]:
                                                    priority === key,
                                            }
                                        )}
                                        onClick={() =>
                                            handleSetPriority(
                                                key as $Enums.Priority
                                            )
                                        }
                                    >
                                        <div className="w-5 h-5 p-[1px] pt-1 pb-0 mr-2">
                                            {value.icon}
                                        </div>
                                        {value.label}
                                    </Button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
