import { PlusIcon } from '@heroicons/react/24/solid';
import Button from '../button';

function CreateListForm() {
    return (
        <form className="flex items-center w-full">
            <PlusIcon className="h-6 text-[#0D6EFD] mr-4" />
            <input
                type="text"
                name="listName"
                placeholder="name.."
                className="flex-grow w-12 h-9 outline-none"
            ></input>
        </form>
    );
}

export default CreateListForm;
