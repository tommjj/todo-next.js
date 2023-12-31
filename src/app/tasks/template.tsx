import AppHeader from '@/components/ui/app-header';
import SideNav from '@/components/ui/nav/side-nav';

function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-screen h-screen pt-12 md:pt-14">
            <AppHeader />
            <div className="flex w-full h-full relative">
                <aside>
                    <SideNav />
                </aside>
                <div className="flex grow overflow-hidden">{children}</div>
            </div>
        </div>
    );
}

export default Template;
