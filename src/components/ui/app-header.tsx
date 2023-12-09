import Logo from '../logo';
import Header from './header';

function AppHeader() {
    return (
        <Header className="w-screen h-14 fixed top-0 left-0 md:px-4 lg:px-4">
            <Logo />
            <div></div>
        </Header>
    );
}

export default AppHeader;
