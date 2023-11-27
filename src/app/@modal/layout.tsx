import Modal from '@/components/ui/modal';

function modalLayout({ children }: { children: string }) {
    return <Modal>{children}</Modal>;
}

export default modalLayout;
