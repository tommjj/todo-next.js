'use server';

import dynamic, {
    DynamicOptionsLoadingProps,
    LoaderComponent,
} from 'next/dynamic';

export default async function NoSSR({
    children,
    fallback,
}: {
    children: React.ReactNode;
    fallback?: (loadingProps: DynamicOptionsLoadingProps) => JSX.Element | null;
}) {
    const SSRC = dynamic(
        (): LoaderComponent<{}> =>
            new Promise((resolveOuter) => {
                const Children = () => {
                    return <>{children}</>;
                };

                resolveOuter(Children);
            }),
        {
            ssr: false,
            loading: fallback || (() => <></>),
        }
    );

    return <SSRC />;
}
