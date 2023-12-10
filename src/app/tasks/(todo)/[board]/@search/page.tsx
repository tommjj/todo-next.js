function DetailsPage({ searchParams }: { searchParams?: { q?: string } }) {
    if (searchParams?.q === undefined) return null;

    return <h1>search {searchParams?.q}</h1>;
}

export default DetailsPage;
