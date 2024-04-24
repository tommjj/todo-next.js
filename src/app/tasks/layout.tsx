import { MainLoadingOverlay } from '@/components/ui/loading/loading';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <MainLoadingOverlay />
            {children}
        </>
    );
}
