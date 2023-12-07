import { auth, signOut } from '@/auth';
import Button from './button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './drop-down-nenu';

async function UserButton() {
    const session = await auth();

    const isSignIn = !!session?.user;

    if (!isSignIn) {
        return (
            <div className="flex ">
                <Button
                    href="/sign-in"
                    className="mx-1 py-[6px]"
                    variant="ghost"
                    scroll={false}
                >
                    sign in
                </Button>
                <Button
                    href="/sign-up"
                    className="mx-1 py-[6px]"
                    variant="primary"
                    scroll={false}
                >
                    sign up
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" className="px-2">
                    {session.user?.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#fafafb] dark:bg-[#040130]">
                <DropdownMenuItem>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <Button variant="ghost" className="w-32" type="submit">
                            sign out
                        </Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserButton;
