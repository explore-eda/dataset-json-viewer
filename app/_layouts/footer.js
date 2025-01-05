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
        className="mx-5 max-h-10 w-96 border overflow-auto rounded-md border-custom-beige hover:bg-gray-100 cursor-pointer"
        onClick={handleExpandClick}
      >
        <div className="flex items-center content-center w-full">
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
                d="M19 9l-7 7-7-7"
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
                d="M5 15l7-7 7 7"
              />
            </svg>
          )}
          <div className="ml-2 overflow-y-auto">
            {applicationStatus[0]}
          </div>
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
        <div className="w-96 py-2 h-10 bg-custom-blue">
          <div className="text-white text-sm text-left font-bold pl-5">
            Log Stream
          </div>
        </div>

        <div className="h-96 w-96 bg-custom-beige overflow-y-auto">
          <ul className="mx-5 mt-2 list-none">
            {applicationStatus.map((status, index) => (
              <li className="" key={index}>
                {status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}