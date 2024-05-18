'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

type NavContextType = {
    isOpen: boolean;
    width: number;
};

type NavContextAction = {
    setWidth: (w: number) => void;
    toggleNav: () => void;
    openNav: () => void;
    closeNav: () => void;
};

const NAV_STORAGE_KEY = 'nav';

const DEFAULT_STATE: NavContextType = {
    isOpen: true,
    width: 300,
};

const NavContext = createContext<
    (NavContextType & NavContextAction) | undefined
>(undefined);

const getStateFromStorage = (): NavContextType | undefined => {
    try {
        const state = localStorage?.getItem(NAV_STORAGE_KEY);
        if (!state) return undefined;
        return JSON.parse(state);
    } catch (err) {
        return undefined;
    }
};

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
    const [navState, setNavState] = useState(
        getStateFromStorage() || DEFAULT_STATE
    );

    const toggleNav = useCallback(() => {
        setNavState((priv) => ({ ...priv, isOpen: !priv.isOpen }));
    }, []);

    const openNav = useCallback(() => {
        setNavState((priv) => ({ ...priv, isOpen: true }));
    }, []);

    const closeNav = useCallback(() => {
        setNavState((priv) => ({ ...priv, isOpen: false }));
    }, []);

    const setWidth = useCallback((newWidth: number) => {
        setNavState((priv) => ({ ...priv, width: newWidth }));
    }, []);

    // * save state
    useEffect(() => {
        localStorage.setItem(
            NAV_STORAGE_KEY,
            JSON.stringify({
                isOpen: navState.isOpen,
                width: navState.width,
            } satisfies NavContextType)
        );
    }, [navState.isOpen, navState.width]);

    return (
        <NavContext.Provider
            value={{ ...navState, setWidth, openNav, closeNav, toggleNav }}
        >
            {children}
        </NavContext.Provider>
    );
};

export const useNavContext = () => {
    const context = useContext(NavContext);

    if (!context) throw new Error('Nav Context');

    return context;
};
