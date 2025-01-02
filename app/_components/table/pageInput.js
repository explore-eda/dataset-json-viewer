import React, { use, useEffect } from 'react';
import { useTabStore } from '../../_utils/zustand/tablestore';
import useFetchReloadDataset from '../../_utils/useFetchReloadDataset'; 

const PageInput = () => {
  const { tabs, currentTab, setPage } = useTabStore();
  const { fetchReloadDataset } = useFetchReloadDataset();

  const handleClick = (page) => {
    setPage(currentTab, page);
  }

  useEffect(() => {
    if(!(tabs[currentTab]?.type === "library")) {
      fetchReloadDataset();
    }
  }, [tabs[currentTab]?.page]);

  useEffect(() => {
    if(tabs[currentTab]?.page > tabs[currentTab]?.totalPages-1) {
      setPage(currentTab, tabs[currentTab]?.totalPages - 1);
    }
  }, [tabs[currentTab]?.totalPages]);

  if (tabs[currentTab]?.totalPages >= 0 && Number.isInteger(tabs[currentTab]?.totalPages)) {
    return (
      <div>
        {[...Array(tabs[currentTab]?.totalPages)].map((_, i) => (
          <button 
              key={i} 
              onClick={() => handleClick(i)} 
              className={`px-3 py-1 rounded-md ${i === tabs[currentTab]?.page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
            >
              {i}
            </button>        ))}
      </div>
    );
  } else {
    // Handle the case where totalPages is invalid
    return null; // or a placeholder, or a warning message
  }
};

export default PageInput;