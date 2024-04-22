import DetailsContainer from '@/components/ui/details/detail';

function DetailsPage({
    searchParams,
}: {
    searchParams?: { details?: string };
}) {
    if (!searchParams?.details) return null;

    return <DetailsContainer id={searchParams.details} />;
}

export default DetailsPage;
