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
    fetchReloadDataset();
  }, [tabs[currentTab]?.page]);

  useEffect(() => {
    console.log('total pages changed');
    console.log(tabs[currentTab]?.totalPages);
    console.log(tabs[currentTab]?.page);

    if(tabs[currentTab]?.page > tabs[currentTab]?.totalPages-1) {
      console.log('setting page to last page');
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