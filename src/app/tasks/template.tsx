import SideNav from '@/components/ui/nav/nav';

function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex relative w-screen h-screen">
            <SideNav />
            <div className="flex grow justify-center overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
}

export default Template;
