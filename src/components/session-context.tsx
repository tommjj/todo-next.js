'use client';

import { createContext, useContext } from 'react';
import { UserSession } from '../../nextauth';

export const SessionContext = createContext<UserSession | undefined>(undefined);

export const useSession = () => {
    const session = useContext(SessionContext);

    return session;
};

export const SessionProvider = ({
    children,
    user,
}: {
    children: React.ReactNode;
    user?: UserSession;
}) => {
    return (
        <SessionContext.Provider value={user}>
            {children}
        </SessionContext.Provider>
    );
};

export const Test = () => {
    const user = useSession();
    return (
        <button className="p-2" onClick={() => console.log(user)}>
            click to log!
        </button>
    );
};
