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
            <main className="w-full h-full flex flex-col">{children}</main>
            <aside>{details}</aside>
            {search}
        </>
    );
}

export default Layout;
