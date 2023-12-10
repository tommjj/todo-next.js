'use server';

import { getLists } from '@/lib/data';
import Nav from './nav';

export default async function SideNav() {
    const [lists, err] = await getLists();

    if (err) return null;
    return <Nav lists={lists} />;
}
