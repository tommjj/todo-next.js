import DetailsContainer from '@/components/ui/details/detail';

function DetailsPage({
    searchParams,
}: {
    searchParams?: { details?: string };
}) {
    return <DetailsContainer id={searchParams?.details} />;
}

export default DetailsPage;
