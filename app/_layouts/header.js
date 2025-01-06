import React from "react";
import { FileMenu, Tools, Help } from "../_components/menubar";
import AddressBar from "../_components/addressbar";
import logo from "../../public/assets/eda_only_logo-nobg.png";
import Image from "next/image";
/* e8e0de */
/* F9D74D */
export default function Header({
  handleOpenAPIOverlay,
  handleFileOpen,
  handleDownload,
  clearFunction,
  addressBarText,
  pagingFunction,
  columnFunction,
  rowFunction,
  sortFunction,
  copyToast,
}) {
  return (
    <header className="flex bg-custom-beige flex-col w-full text-lg shadow-lg ">
      <div className="bg-custom-blue w-full h-10 justify-center content-center py-2 text-sm font-bold text-white text-center">
        <em>Dataset-JSON Viewer</em>
      </div>
      <div className="flex w-full flex-col items-center center content-center md:flex-row md:items-baseline md:justify-between mx-auto md:mx-0">
        <div className="flex md:hidden font-bold mt-2">
          <a
            href="https://edaclinical.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="h-auto w-20">
              <Image src={logo} alt="EDA Logo" layout="intrinsic" />
            </div>
          </a>
        </div>

        <div className="flex flex-row gap-2 mb-2 md:mt-1 md:mx-8">
          <FileMenu
            handleOpenAPIOverlay={handleOpenAPIOverlay}
            handleFileOpen={handleFileOpen}
            handleDownload={handleDownload}
            clearFunction={clearFunction}
          />
          <Tools
            pagingFunction={pagingFunction}
            columnFunction={columnFunction}
            rowFunction={rowFunction}
            sortFunction={sortFunction}
          />
          <Help />
        </div>

        <div className="self-center flex max-md:hidden md:block font-bold ml-2 md:mx-8">
          <a
            href="https://edaclinical.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="h-auto w-20">
              <Image src={logo} alt="EDA Logo" layout="intrinsic" />
            </div>
          </a>
        </div>
      </div>

      <AddressBar
        addressBarText={addressBarText}
        handleOpenAPIOverlay={handleOpenAPIOverlay}
        handleFileOpen={handleFileOpen}
        copyToast={copyToast}
      />
    </header>
  );
}

//         <div className="font-bold ml-2 md:mx-5">EDA JSON Viewer</div>
