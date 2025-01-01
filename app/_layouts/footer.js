import React from "react";
import PageInput from "../_components/table/pageInput";
import { useDataStore } from "../_utils/zustand/tablestore";

export default function Footer() {
  const { applicationStatus } = useDataStore();

  return (
    <footer className="bg-custom-beige w-full h-20 flex text-lg sm:px-0 items-center justify-between">
      <div className="ml-5 overflow-y-auto max-h-16 my-2 w-full"> 
        <ul className="list-none">
          {applicationStatus.map((status, index) => (
            <li key={index}>{status}</li>
          ))}
        </ul>
      </div>
      <div className="mr-5"><PageInput/></div>
    </footer>
  );
}