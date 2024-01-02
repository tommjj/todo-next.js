import Logo from '../logo';
import Header from './header';
import { getSessionUser } from '@/lib/auth';
import { UserMenu } from './user-button';

async function AppHeader() {
    const user = await getSessionUser();

    return (
        <Header className="w-screen h-12 md:h-14 fixed top-0 left-0 md:px-4 lg:px-4 bg-[#0D6EFD] dark:bg-[#0058dc] text-[#FAFAFA]">
            <Logo />
            <div>
                <UserMenu name={user?.name} className="text-[#FFFFFF]" />
            </div>
        </Header>
    );
}

export default AppHeader;
