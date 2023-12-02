import Logo from '../logo';

function AppHeader() {
    return (
        <header className="w-screen h-14 flex fixed top-0 left-0 justify-between items-center md:px-4 lg:px-4">
            <Logo />
            <div></div>
        </header>
    );
}

export default AppHeader;
