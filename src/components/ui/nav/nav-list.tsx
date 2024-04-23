import { useParams } from 'next/navigation';
import Button from '../button';
import { Lists } from '@/lib/definitions';

import { GoHash } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import CreateListForm from '../create-list/create-list-form';

export const NavLink = () => {
    return (
        <Button
            className="px-[8px] py-[5px] justify-start w-full grow text-sm font-normal "
            variant="ghost"
        >
            <div>
                <GoHash className="w-6 h-6 p-[0.20rem] mr-[8px] text-[#444] dark:text-inherit" />
            </div>
            <div className="flex-grow line-clamp-1 text-left">
                Search ab sdvhjef dadwa wdad wdada wda
            </div>
        </Button>
    );
};

export const NavLinks = ({ lists }: { lists: Lists }) => {
    const [isOpen, setIsOpen] = useState(true);

    const { board } = useParams();

    const toggleList = useCallback(() => setIsOpen((priv) => !priv), []);

    return (
        <div className="px-[10px] w-full mt-5">
            <Button
                onClick={toggleList}
                className="group px-[10px] py-[5px] justify-between w-full grow font-normal text-base"
                variant="ghost"
            >
                {/* < className="w-6 h-6 mr-[8px] text-[#444] dark:text-inherit" /> */}
                My lists
                <div className="p-0 rounded-sm">
                    <IoIosArrowForward
                        className={cn(
                            'h-6 w-6 p-1 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100',
                            {
                                'rotate-90': isOpen,
                            }
                        )}
                    />
                </div>
            </Button>
            <ul
                className={cn(
                    'overflow-hidden max-h-96 transition-all duration-300',
                    {
                        'max-h-0': !isOpen,
                    }
                )}
            >
                {/* {lists.map((item) => (
                <li key={item.id}>
                    <NavLink active={`${item.id}` === board} list={item} />
                </li>
            ))} */}
                <li>
                    <NavLink />
                </li>
                <li>
                    <CreateListForm />
                </li>
            </ul>
        </div>
    );
};
