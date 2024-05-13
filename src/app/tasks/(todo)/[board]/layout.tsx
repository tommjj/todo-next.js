function Layout({
    children,
    details,
}: {
    children: React.ReactNode;
    details: React.ReactNode;
}) {
    return (
        <>
            <div className="w-full h-full flex flex-col">{children}</div>
            {details}
        </>
    );
}

export default Layout;
