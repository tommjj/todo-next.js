import AppHeader from '@/components/ui/app-header';

function Template({
    children,
    details,
}: {
    children: React.ReactNode;
    details: React.ReactNode;
}) {
    return (
        <div className="flex w-screen h-screen pt-14">
            <AppHeader />
            <aside className="">
                <nav className="w-[290px] h-screen absolute top-0 left-0 sm:w-[200px] md:relative lg:w-[290px]">
                    <ul className="flex flex-col">
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                    </ul>
                </nav>
            </aside>
            <main className="flex bg-red-400 grow">{children}</main>
        </div>
    );
}

export default Template;
