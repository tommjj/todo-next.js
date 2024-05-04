import { MainLoadingOverlay } from '@/components/ui/loading/loading';
import SideNav from '@/components/ui/nav/nav';
import { NavProvider } from '@/components/ui/nav/nav-context';

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <NavProvider>
            <MainLoadingOverlay />
            <div className="flex relative w-screen h-screen overflow-x-hidden">
                <SideNav />
                <div className="flex grow justify-center h-full overflow-hidden custom-scrollbar bg-main-bg-color dark:bg-main-bg-color-dark ">
                    {children}
                </div>
            </div>
        </NavProvider>
    );
}

export default Layout;
