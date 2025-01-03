import React from "react";
import { useDataStore } from "../../_utils/zustand/tablestore";

export default function TabList({tabs, currentTab, setCurrentTab, removeTab}) {
  const { setApplicationStatus } = useDataStore();

  const handleTableClick = (tabName) => {
    setCurrentTab(tabName);
  };

  const handleRemoveTab = (tabName) => {
    removeTab(tabName);
    setApplicationStatus(`${tabName} Table Closed`);
  };

  return (
    <div className="flex gap-1 mb-2">
      {Object.keys(tabs).length > 0 &&
        Object.keys(tabs).map((tabName) => (
          <div key={tabName} 
          className={`bg-custom-beige flex items-center rounded-b-lg shadow-lg ${
            currentTab === tabName
              ? "bg-white"
              : "bg-custom-beige"
          }`}> 
            <button
              onClick={() => handleTableClick(tabName)}
            >
              {tabName}
            </button>
            <button 
              onClick={() => handleRemoveTab(tabName)} 
              className="ml-1 px-2 py-1 text-xs text-black rounded-full hover:bg-gray-100" // Add rounded-full here
            >
              X
            </button>
          </div>
        ))}
    </div>
  );
}