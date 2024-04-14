import { ResizeContainerRight } from '@/components/ui/resize-container';

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
            <aside>
                <ResizeContainerRight
                    className="bg-white dark:bg-[#111]  flex flex-col  lg:shadow-[-2px_0_5px_rgba(0,0,0,0.2)]"
                    defaultWidth={360}
                    minWidth={100}
                    maxWidth={600}
                ></ResizeContainerRight>
            </aside>

            <main className="w-full h-full flex flex-col">{children}</main>
            {details}
            {search}
        </>
    );
}

export default Layout;
