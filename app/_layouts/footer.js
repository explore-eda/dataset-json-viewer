import React from "react";
import PageInput from "../_components/table/pageInput";
import { useDataStore } from "../_utils/zustand/tablestore";
import "animate.css";

export default function Footer({ tab, setPage }) {
  const { applicationStatus } = useDataStore();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <footer className="bg-custom-beige w-full h-20 flex sm:px-0 items-center justify-between">
      <div
        className="overflow-y-auto mx-5  max-h-16 mt-2 w-96 hover:bg-custom-beige-dark hover:border-x hover:border-t hover:border-gray-500 cursor-pointer"
        onClick={handleExpandClick}
      >
        <div className="flex justify-between items-center content-center w-full">
          <ul className="ml-2 mt-2 list-none w-full">
            {applicationStatus.map((status, index) => (
              <li key={index}>{`${
                applicationStatus.length - 1 - index
              }: ${status}`}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mr-5">
        <PageInput tab={tab} setPage={setPage} />
      </div>
      <div
        className={`z-40  absolute bottom-0 left-5 shadow-lg border-x border-t border-gray-500 ${
          isExpanded
            ? "animate__animated animate__slideInUp"
            : "animate__animated animate__slideInDown hidden"
        }`}
        onClick={handleExpandClick}
      >
        <div className="w-96 py-2 bg-custom-blue">
          <h1 className="text-white text-sm text-left pl-5">Log Stream</h1>
        </div>

        <div className="h-96 w-96 bg-custom-beige overflow-y-auto">
          <ul className="mx-5 mt-2 list-none">
            {applicationStatus.map((status, index) => (
              <li className="" key={index}>{`${
                applicationStatus.length - 1 - index
              }: ${status}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}


/*<div className="w-12">
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div> */