import React from "react";
import { useTabStore, useLibraryTableStore } from "../../_utils/zustand/tablestore";

export default function TabList() {
  const { tabs, currentTab, setCurrentTab, tablistActive } = useTabStore();
  const { setLibraryTableActive, libraryTableActive } = useLibraryTableStore();

  const handleTableClick = (tabName) => {
    setLibraryTableActive(false);
    setCurrentTab(tabName);
  };

  const handleLibraryClick = () => {
    setCurrentTab(null);
    setLibraryTableActive(true);
  };

  return (
    <div className="flex space-x-2 border-b">
      {tablistActive &&
      <button
        onClick={handleLibraryClick}
        className={`px-4 py-2 border-b-2 ${libraryTableActive ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-500'}`}
      >
        Library
      </button>
      }
      {Object.keys(tabs).length > 0 &&
        Object.keys(tabs).map((tabName) => (
          <button
            key={tabName}
            onClick={() => handleTableClick(tabName)}
            className={`px-4 py-2 border-b-2 ${
              currentTab === tabName
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            {tabName}
          </button>
        ))}
    </div>
  );
}