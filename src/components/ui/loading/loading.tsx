'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

// * just delay
export const MainLoadingOverlay = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return isLoading ? (
        <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-main-bg-color dark:bg-main-bg-color-dark z-[999]">
            <div>
                <div>
                    <Image
                        className="h-[72px] w-[72px]"
                        src={'/images/TODO_LOGO.png'}
                        alt="LOGO"
                        width={72}
                        height={72}
                    />
                </div>
                <div className="flex justify-center mt-6 ">
                    <div className="flex-grow-0 animate-spin rounded-full border">
                        <AiOutlineLoading className="w-6 h-6 text-nav-bg-color-dark" />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};
