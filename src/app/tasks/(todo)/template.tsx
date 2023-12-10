import AppHeader from '@/components/ui/app-header';
import SideNav from '@/components/ui/nav/side-nav';

function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-screen h-screen pt-14">
            <AppHeader />
            <aside className="">
                <SideNav />
            </aside>
            <div className="flex bg-red-400 grow">{children}</div>
        </div>
    );
}

export default Template;
