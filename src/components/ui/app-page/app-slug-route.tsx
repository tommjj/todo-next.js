'use client';

import {
    createContext,
    JSXElementConstructor,
    useCallback,
    useContext,
    useLayoutEffect,
    useState,
} from 'react';

const SlugContext = createContext<
    | {
          isLoading: boolean;
          isNotFound: boolean;
          notFound: () => void;
          match: (s: string) => boolean;
      }
    | undefined
>(undefined);

const SlugProvider = ({
    slug,
    children,
    defaultElement,
    notFoundElement,
}: {
    notFoundElement: React.ReactNode;
    defaultElement: React.ReactNode;
    slug: string;
    children: React.ReactNode;
}) => {
    const [state, setState] = useState({
        isMath: false,
        isLoading: false,
        isNotFound: false,
    });

    useLayoutEffect(() => {
        setState({
            isMath: false,
            isLoading: false,
            isNotFound: false,
        });
    }, [slug]);

    const notFound = useCallback(() => {
        setState({
            isMath: false,
            isLoading: false,
            isNotFound: true,
        });
    }, []);

    const match = useCallback(
        (s: string) => {
            const isMath = s === slug;
            setState((priv) => ({ ...priv, isMath }));
            return isMath;
        },
        [slug]
    );

    return (
        <SlugContext.Provider value={{ ...state, notFound, match }}>
            {children}

            {state.isNotFound && notFoundElement}
            {state.isMath && defaultElement}
        </SlugContext.Provider>
    );
};

const useSlug = (slug: string) => {
    const state = useContext(SlugContext);

    if (!state) throw new Error('Slug context err');

    state.match(slug);

    return state;
};

const Route = ({}: {
    loader?: Promise<any>;
    slug: string;
    element: React.ReactNode;
}) => {
    return;
};
