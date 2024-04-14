import SideNav from '@/components/ui/nav/side-nav';

function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-screen h-screen">
            <div className="flex w-full h-full relative">
                <aside>
                    <SideNav />
                </aside>
                <div className="flex grow ">{children}</div>
            </div>
        </div>
    );
}

export default Template;
