import { MainLoadingOverlay } from '@/components/ui/loading/loading';
import { NavProvider } from '@/components/ui/nav/nav-context';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <NavProvider>
            <MainLoadingOverlay />
            {children}
        </NavProvider>
    );
}
