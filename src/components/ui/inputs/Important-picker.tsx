import { useCallback, useState } from 'react';
import Button from '../button';

import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export const ImportantPicker = ({
    defaultValue = false,
    onChange = () => {},
}: {
    onChange?: (state: boolean) => void;
    defaultValue?: boolean;
}) => {
    const [important, setImportant] = useState(defaultValue);

    const handleClick = useCallback(() => {
        setImportant(!important);
        onChange(!important);
    }, [important, onChange]);

    return (
        <Button
            onClick={handleClick}
            type="button"
            variant="ghost"
            className="text-[0.8rem] leading-4 px-2 py-[5px] font-light border"
        >
            {important ? (
                <StarIconSolid className="w-4 h-4 opacity-80 text-primary-color" />
            ) : (
                <StarIconOutline className="w-4 h-4 opacity-50" />
            )}
        </Button>
    );
};
