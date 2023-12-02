function Layout({
    children,
    details,
}: {
    children: React.ReactNode;
    details: React.ReactNode;
}) {
    return (
        <>
            <main className="grow">{children}</main>
            <aside>{details}</aside>
        </>
    );
}

export default Layout;
