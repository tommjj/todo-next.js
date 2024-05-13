import NoSSR from '@/components/NoSSR';
import DetailsContainer from '@/components/ui/details/detail';

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="w-full h-full flex flex-col">{children}</div>

            <NoSSR>
                <DetailsContainer />
            </NoSSR>
        </>
    );
}

export default Layout;
