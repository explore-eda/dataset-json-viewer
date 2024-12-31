import React from "react";
import PagnationSelection from "../_components/table/pagnationselection";
import { useDataStore } from "../_utils/zustand/tablestore";
 

export default function Footer() {
  const { applicationStatus } = useDataStore();

  return (
    <footer className="bg-custom-beige w-full h-20 flex text-lg sm:px-0 items-center justify-between">
      <div className="ml-5">{applicationStatus}</div>
      <div className="mr-5"><PagnationSelection/></div>
    </footer>
  );
}
