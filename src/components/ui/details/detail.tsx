'use client';

import useStore from '@/store/store';
import ResizeContainer from '../resize-container';

export default function DetailsContainer({ id }: { id: string }) {
    const list = useStore((state) => state.list);

    const task = list && list.tasks?.find((e) => e.id === id);

    return (
        <>
            {task && (
                <ResizeContainer
                    defaultWidth={360}
                    minWidth={360}
                    maxWidth={700}
                >
                    Details
                </ResizeContainer>
            )}
        </>
    );
}
