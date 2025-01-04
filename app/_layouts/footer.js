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
        className="overflow-y-auto max-h-16 my-2 w-96"
        onClick={handleExpandClick}
      >
        <div className="mx-5 flex justify-between items-center content-center">
          <ul className="list-none">
            {applicationStatus.map((status, index) => (
              <li className="" key={index}>{`${
                applicationStatus.length - 1 - index
              }: ${status}`}</li>
            ))}
          </ul>

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
        </div>
      </div>
      <div className="mr-5">
        <PageInput tab={tab} setPage={setPage} />
      </div>
      <div
        className={`z-40 absolute bottom-0 left-5 shadow-lg ${
          isExpanded
            ? "animate__animated animate__slideInUp"
            : "animate__animated animate__slideInDown hidden"
        }`}
        onClick={handleExpandClick}
      >
        <div className="w-96 py-2 bg-custom-blue">
          <h1 className="text-white font-bold text-center">
            Application Status
          </h1>
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
