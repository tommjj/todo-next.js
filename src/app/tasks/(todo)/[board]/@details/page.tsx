function DetailsPage({
    searchParams,
}: {
    searchParams?: { details?: string };
}) {
    if (!searchParams?.details) return null;

    return <h1>details {searchParams?.details}</h1>;
}

export default DetailsPage;
