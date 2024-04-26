import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../drop-down-menu/drop-down-menu';
import AlertDialog, {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../alert-dialog/alert-dialog';
import { BsLayoutSidebarReverse } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import Button from '../button';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const DetailHeader = () => {
    const { push } = useRouter();

    const handleClose = useCallback(() => {
        push(`?`);
    }, [push]);

    return (
        <header className="flex items-center justify-center w-full h-14">
            <div className="flex justify-between w-full m-[0.63rem]">
                <div
                    className={cn('bg-nav-bg-color dark:bg-nav-bg-color-dark')}
                >
                    <Button
                        onClick={handleClose}
                        className="group p-[8px] "
                        variant="ghost"
                        aria-controls="toggle nav"
                    >
                        <BsLayoutSidebarReverse className="w-[17px] h-[17px] text-[#666] group-hover:text-[#333] dark:text-nav-text-color-dark group-hover:dark:text-nav-text-color-dark" />
                    </Button>
                </div>
            </div>
        </header>
    );
};
