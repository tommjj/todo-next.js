function Page({ params }: { params: { board: string } }) {
    return <h1>{params.board}</h1>;
}

export default Page;
