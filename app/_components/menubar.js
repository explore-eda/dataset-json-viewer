import { useRef } from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ArrowRightCircleIcon,
  ChevronDownIcon,
  XCircleIcon,
  FolderOpenIcon,
  PencilIcon,
  CloudArrowDownIcon,
  Bars3Icon,
  BarsArrowUpIcon,
  BookOpenIcon,
  ArrowsUpDownIcon
} from "@heroicons/react/16/solid";

export function FileMenu({
  handleOpenAPIOverlay,
  handleFileOpen,
  clearFunction,
  handleDownload,
}) {
  const menuButtonRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileOpen(file);
    menuButtonRef.current.click();
    event.target.value = "";
  };

  return (
    <Menu>
      <MenuButton
        ref={menuButtonRef}
        className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-gray-100"
      >
        File
        <ChevronDownIcon className="size-4 fill-black/60" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom-start"
        className="w-auto rounded-md border shadow-lg border-black/5 bg-gray-100 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button
            className="group flex w-32 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
            onClick={handleOpenAPIOverlay}
          >
            <ArrowRightCircleIcon className="size-4 fill-black/30" />
            API Request
          </button>
        </MenuItem>
        <MenuItem>
          <FileUploadMenuItem onFileChange={handleFileChange} />
        </MenuItem>
        <div className="my-1 h-px bg-black/5" />
        <MenuItem>
          <button
            className="group flex w-32 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
            onClick={handleDownload}
          >
            <CloudArrowDownIcon className="size-4 fill-black/30" />
            Download
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="group flex w-32 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
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

const FileUploadMenuItem = ({ onFileChange }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    console.log("FileUploadMenuItem: File changed", event.target.files[0]);
    onFileChange(event);
    event.target.value = "";
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        className="group flex w-32 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10 hover:bg-black/10"
        onClick={handleButtonClick}
      >
        <FolderOpenIcon className="size-4 fill-black/30" />
        Open
      </button>
    </div>
  );
};

export function Tools({
  pagingFunction,
  columnFunction,
  rowFunction,
  sortFunction}
) {
  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-gray-100">
        Tools
        <ChevronDownIcon className="size-4 fill-black/60" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom-start"
        className="w-auto rounded-md border shadow-lg border-black/5 bg-gray-100 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button
            onClick={columnFunction}
            className="group flex w-40 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <BarsArrowUpIcon className="size-4 fill-black/30" />
            Column
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={rowFunction}
            className="group flex w-40 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <Bars3Icon className="size-4 fill-black/30" />
            Row
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={sortFunction}
            className="group flex w-40 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <ArrowsUpDownIcon className="size-4 fill-black/30" />
            Sort
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={pagingFunction}
            className="group flex w-40 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <BookOpenIcon className="size-4 fill-black/30" />
            Paging
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export function Help() {
  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-gray-100">
        Help
        <ChevronDownIcon className="size-4 fill-black/60" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom-start"
        className="w-auto rounded-md border shadow-lg border-black/5 bg-gray-100 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button
            onClick={() => window.open("", "_blank")}
            className="group flex w-32 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <PencilIcon className="size-4 fill-black/30" />
            Github
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => window.open("", "_blank")}
            className="group flex w-32 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <PencilIcon className="size-4 fill-black/30" />
            Contact
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => window.open("", "_blank")}
            className="group flex w-32 items-center gap-2 py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <PencilIcon className="size-4 fill-black/30" />
            Book Meeting
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export default FileMenu;
