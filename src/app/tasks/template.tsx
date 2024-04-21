import SideNav from '@/components/ui/nav/nav';

function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-screen h-screen">
            <div className="flex w-full h-full relative">
                <aside>
                    <SideNav />
                </aside>
                <div className="flex grow justify-center">{children}</div>
            </div>
        </div>
    );
}

export default Template;
