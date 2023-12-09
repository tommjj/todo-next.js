// import { createPortal } from 'react-dom';

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
            <main className="grow">{children}</main>
            <aside>
                {details} {search}
            </aside>
        </>
    );
}

export default Layout;
