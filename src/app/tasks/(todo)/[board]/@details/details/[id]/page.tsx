import DetailsContainer from '@/components/ui/details/detail';

type Props = { params: { id: string } };

function DetailsPage({ params }: Props) {
    return <DetailsContainer id={params.id} />;
}

export default DetailsPage;
