import React from "react";
import PagnationSelection from "../_components/table/pagnationselection";
export default function Footer({ statusText }) {
  return (
    <footer className="bg-custom-beige w-full h-20 flex text-lg sm:px-0 items-center justify-between">
      <div className="ml-5">{statusText}</div>
      <div className="mr-5"><PagnationSelection/></div>
    </footer>
  );
}
