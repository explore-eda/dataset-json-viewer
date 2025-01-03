import React, { use, useState, useEffect } from 'react';

const PageInput = ({tab, setPage}) => {

  const handleClick = (page) => {
    setPage(tab.tabID, page);
  }

  const maxPage = tab?.totalPages - 1;

  const [inputValue, setInputValue] = useState(tab?.page ?? 0);

  useEffect(() => {
    setInputValue(tab?.page);
  }, [tab?.page]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleInputBlur = () => {
    setPage(tab.tabID, inputValue);
  }

  if(tab?.totalPages >= 6 && Number.isInteger(tab?.totalPages)){
    return (
      <div>
        <button onClick={() => handleClick(0)} className={`px-3 py-1 rounded-md ${tab?.page === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>0</button>
        <button onClick={() => handleClick(1)} className={`px-3 py-1 rounded-md ${tab?.page === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>1</button>
        <button onClick={() => handleClick(2)} className={`px-3 py-1 rounded-md ${tab?.page === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>2</button>
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min="0"
          max={tab?.totalPages - 1}
          className="border rounded-md px-3 py-1 mx-2"
        ></input>
        <button onClick={() => handleClick(tab?.totalPages - 3)} className={`px-3 py-1 rounded-md ${tab?.page === tab?.totalPages - 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{tab?.totalPages - 3}</button>
        <button onClick={() => handleClick(tab?.totalPages - 2)} className={`px-3 py-1 rounded-md ${tab?.page === tab?.totalPages - 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{tab?.totalPages - 2}</button>
        <button onClick={() => handleClick(tab?.totalPages - 1)} className={`px-3 py-1 rounded-md ${tab?.page === tab?.totalPages - 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{tab?.totalPages - 1}</button>
        
      </div>
    );
  }

  if (tab?.totalPages >= 0 && Number.isInteger(tab?.totalPages)) {
    return (
      <div>
        {[...Array(tab?.totalPages)].map((_, i) => (
          <button 
              key={i} 
              onClick={() => handleClick(i)} 
              className={`px-3 py-1 rounded-md ${i === tab?.page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
            >
              {i}
            </button>        ))}
      </div>
    );
  } else {
    return null; 
  }
};

export default PageInput;