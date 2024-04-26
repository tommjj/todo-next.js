import NoSSR from '@/components/NoSSR';
import DetailsContainer from '@/components/ui/details/detail';

function DetailsPage({
    searchParams,
}: {
    searchParams?: { details?: string };
}) {
    return (
        <NoSSR>
            <DetailsContainer id={searchParams?.details} />
        </NoSSR>
    );
}

export default DetailsPage;
