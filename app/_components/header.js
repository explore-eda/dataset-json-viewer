import React from "react";
import { FileMenu, Tools, Help } from "./menubar/menubar";
import AddressBar from "./addressbar";
/* e8e0de */
/* F9D74D */
export default function Header({
  uploadFunction,
  openFunction,
  clearFunction,
  setApiAddress,
  apiAddress,
}) {

  return (
    <header className="flex bg-[#e8e0de] flex-col w-full text-lg">
      <div className="flex flex-row items-baseline mx-auto md:max-w-4xl md:justify-between md:mx-0">
        <menubar className="flex flex-row gap-2 mb-2 mt-4 md:mx-8">
          <FileMenu
            uploadFunction={uploadFunction}
            openFunction={openFunction}
            clearFunction={clearFunction}
          />
          <Tools />
          <Help />
        </menubar>
        <div className="font-bold ml-2 md:mx-5">EDA JSON Viewer</div>
      </div>

      <AddressBar setApiAddress={setApiAddress} apiAddress={apiAddress}/>
    </header>
  );
}