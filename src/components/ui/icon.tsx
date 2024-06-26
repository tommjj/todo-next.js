import { AiOutlineClear } from 'react-icons/ai';
import { BsClipboard } from 'react-icons/bs';
import { CiCalendar, CiTrash } from 'react-icons/ci';
import { FaRegStar } from 'react-icons/fa';
import { GoHash, GoInbox } from 'react-icons/go';
import { IoAddCircleOutline } from 'react-icons/io5';

export function CircleIcon({ className = '' }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            strokeWidth="0.2"
            stroke="currentColor"
            className={className}
        >
            <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm-8 7a8 8 0 1116 0 8 8 0 01-16 0z" />
        </svg>
    );
}

export const ICONS = {
    todo: GoInbox,
    important: FaRegStar,
    planned: CiCalendar,
    list: GoHash,
    task: BsClipboard,
    addTask: IoAddCircleOutline,
    clear: AiOutlineClear,
    delete: CiTrash,
};
