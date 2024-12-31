import React from 'react';
import {useTabStore} from '../../_utils/zustand/tablestore';

const PaginationSelection = () => {
  const { tabs, currentTab, setOffset } = useTabStore();

  return (
    <div>
      {[...Array(tabs[currentTab]?.totalOffset)].map((_, i) => ( 
        <button 
          key={i + 1} 
          onClick={() => setOffset(currentTab, i + 1)} 
          className={i + 1 === tabs[currentTab]?.offset ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default PaginationSelection;