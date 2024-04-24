import SideNav from '@/components/ui/nav/nav';

function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex relative w-screen h-screen">
            <SideNav />
            <div className="flex grow justify-center h-full overflow-hidden custom-scrollbar bg-main-bg-color dark:bg-main-bg-color-dark ">
                {children}
            </div>
        </div>
    );
}

export default Template;
