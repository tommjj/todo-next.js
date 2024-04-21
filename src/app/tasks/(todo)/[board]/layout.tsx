import { ResizeContainer } from '@/components/ui/resize-container';

function Layout({
    children,
    details,
    search,
}: {
    children: React.ReactNode;
    details: React.ReactNode;
    search: React.ReactNode;
}) {
    return (
        <>
            <aside className="relative -mr-[300px] -translate-x-[300px] z-0">
                <ResizeContainer
                    className="bg-white dark:bg-[#111]  flex flex-col  "
                    defaultWidth={300}
                    minWidth={100}
                    maxWidth={600}
                    resizeDir="Left"
                ></ResizeContainer>
            </aside>

            <main className="w-full h-full flex flex-col">{children}</main>
            {details}
            {search}
        </>
    );
}

export default Layout;
