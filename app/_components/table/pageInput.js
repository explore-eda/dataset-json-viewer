import React, {useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const PageInput = ({ tab, setPage }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleClickRight = (page) => {
    const newPage = page + 1;
    if(newPage > tab?.totalPages - 1) {
      return;
    }
    setCurrentPage(newPage);
    setPage(newPage);
  };

  const handleClickLeft = (page) => {
    const newPage = page - 1;
    if(newPage < 0) {
      return;
    }
    setCurrentPage(newPage);
    setPage(newPage);
  };

  const maxPage = tab?.totalPages - 1;

  const [inputValue, setInputValue] = useState(tab?.page ?? 0);

  useEffect(() => {
    setCurrentPage(tab?.page);
    setInputValue(tab?.page);
  }, [tab?.page]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setPage(inputValue);
  };

  console.log("tab", tab);
  
  if (tab?.totalPages) {
    return (
      <div className="flex flex-row">
        <button
          onClick={() => handleClickLeft(currentPage)}
          className={`px-3 py-1 rounded-md flex items-center group bg-custom-blue hover:bg-custom-blue-dark`}
        >
        <ChevronLeftIcon className="h-5 w-5 group-hover:translate-x-[-3px] transition-transform duration-200 text-white" /> 
      </button>
    
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min="0"
          max={tab?.totalPages - 1}
          className="border rounded-md px-3 py-1 mx-2"
        ></input>
    
        <button
          onClick={() => handleClickRight(currentPage)}
          className={`px-3 py-1 rounded-md flex items-center group bg-custom-blue hover:bg-custom-blue-dark`}
        >
          <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-[3px] transition-transform duration-200 text-white" />
        </button>
      </div>
    );
  }
};

export default PageInput;
