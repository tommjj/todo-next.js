'use server';

import { getAllListsBySession } from '@/lib/services/index';
import Nav from './nav';

export default async function SideNav() {
    const [lists, err] = await getAllListsBySession();

    if (err) return null;
    return <Nav lists={lists} />;
}
