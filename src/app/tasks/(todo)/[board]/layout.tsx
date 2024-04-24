import { MainLoadingOverlay } from '@/components/ui/loading/loading';

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
            <div className="w-full h-full flex flex-col">{children}</div>
            {details}
            {search}
        </>
    );
}

export default Layout;
