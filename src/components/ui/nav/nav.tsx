'use server';

import { getAllListsBySession } from '@/lib/services/list.service';

import Nav from './side-nav';
import { NavProvider } from './nav-context';

export default async function SideNav() {
    const [lists, err] = await getAllListsBySession();

    if (err) return null;
    return (
        <NavProvider>
            <Nav lists={lists} />
        </NavProvider>
    );
}
