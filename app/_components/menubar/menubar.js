import { useRef } from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  CloudArrowUpIcon,
  ChevronDownIcon,
  PencilIcon,
  FolderOpenIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";

export function FileMenu({ uploadFunction, openFunction , clearFunction }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Do something with the selected file, e.g., upload it
    console.log(file);
    console.log("Opening File");
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3  shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-gray-100">
        File
        <ChevronDownIcon className="size-4 fill-black/60" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom-start"
        className="w-32 rounded-md border shadow-lg border-black/5 bg-gray-100 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
        <button
            className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
            onClick={uploadFunction}
          >
            <CloudArrowUpIcon className="size-4 fill-black/30" />
            Upload
          </button>
        </MenuItem>
        <MenuItem>
        <button
            className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
            onClick={handleButtonClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <FolderOpenIcon className="size-4 fill-black/30" />

            Open
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-black/5" />
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
            onClick={clearFunction}
          >
            <XCircleIcon className="size-4 fill-black/30" />
            Clear
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export function Tools() {
  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3  shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-gray-100">
        Tools
        <ChevronDownIcon className="size-4 fill-black/60" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom-start"
        className="w-32 rounded-md border shadow-lg border-black/5 bg-gray-100 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10">
            <PencilIcon className="size-4 fill-black/30" />
            Edit
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export function Help() {
  return (
    <Menu>
      <MenuButton
        className="inline-flex items-center gap-2 rounded-md py-1.5 px-3  shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100  data-[focus]:outline-1 data-[focus]:outline-gray-100"
        onClick={() => window.open("", "_blank")}
      >
        Help
      </MenuButton>
    </Menu>
  );
}

export default FileMenu;

/*
<Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3  shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-gray-100">
        File
        <ChevronDownIcon className="size-4 fill-black/60" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom-start"
        className="w-32 rounded-md border shadow-lg border-black/5 bg-gray-100 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10">
            <PencilIcon className="size-4 fill-black/30" />
            Edit
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10">
            <Square2StackIcon className="size-4 fill-black/30" />
            Duplicate
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-black/5" />
        <MenuItem>
          <button className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10">
            <ArchiveBoxXMarkIcon className="size-4 fill-black/30" />
            Archive
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group flex w-full items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10">
            <TrashIcon className="size-4 fill-black/30" />
            Delete
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
    */
