import Logo from '@/components/logo';
import Button from '@/components/ui/button';

interface HeaderProps extends React.AllHTMLAttributes<{}> {
    showUserInformation?: boolean;
}

function Header({ className = '', showUserInformation = true }: HeaderProps) {
    return (
        <header
            className={`flex items-center justify-between w-screen h-14 sticky z-50 ${className}`}
        >
            <Logo />
            {showUserInformation && (
                <div className="flex ">
                    <Button
                        href="/sign-in"
                        className="mx-1 py-[6px]"
                        variant="ghost"
                        roundedFull
                    >
                        sign in
                    </Button>
                    <Button
                        href="/sign-up"
                        className="mx-1 py-[6px]"
                        variant="primary"
                        roundedFull
                    >
                        sign up
                    </Button>
                </div>
            )}
        </header>
    );
}

export default Header;
