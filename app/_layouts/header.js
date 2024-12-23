import React from "react";
import { FileMenu, Tools, Help, Window } from "../_components/menubar";
import AddressBar from "../_components/addressbar";
/* e8e0de */
/* F9D74D */
export default function Header({
  handleOpenAPIOverlay,
  handleFileOpen,
  handleDownload,
  clearFunction,
  addressBarText,
}) {
  return (
    <header className="flex bg-custom-beige flex-col w-full text-lg">
      <div className="bg-custom-blue w-full py-2"></div>
      <div className="flex flex-row items-baseline mx-auto md:max-w-4xl md:justify-between md:mx-0">
        <div className="sm:flex sm:flex-row sm:gap-2 mb-2 mt-1 md:mx-8">
          <FileMenu
            handleOpenAPIOverlay={handleOpenAPIOverlay}
            handleFileOpen={handleFileOpen}
            handleDownload={handleDownload}
            clearFunction={clearFunction}
          />
          <Tools />
          <Window />
          <Help />
        </div>
        <div className="font-bold ml-2 md:mx-5">EDA JSON Viewer</div>
      </div>

      <AddressBar
        addressBarText={addressBarText}
        handleOpenAPIOverlay={handleOpenAPIOverlay}
        handleFileOpen={handleFileOpen}
      />
    </header>
  );
}
