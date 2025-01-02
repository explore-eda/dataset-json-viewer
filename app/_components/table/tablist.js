import React from "react";
import { useTabStore } from "../../_utils/zustand/tablestore";

export default function TabList() {
  const { tabs, currentTab, setCurrentTab, removeTab } = useTabStore();

  const handleTableClick = (tabName) => {
    setCurrentTab(tabName);
  };

  const handleRemoveTab = (tabName) => {
    removeTab(tabName);
  };

  return (
    <div className="flex space-x-2 border-b">
      {Object.keys(tabs).length > 0 &&
        Object.keys(tabs).map((tabName) => (
          <div key={tabName} className="flex items-center"> 
            <button
              onClick={() => handleTableClick(tabName)}
              className={`px-4 py-2 border-b-2 ${
                currentTab === tabName
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {tabName}
            </button>
            <button 
              onClick={() => handleRemoveTab(tabName)} 
              className="ml-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              X
            </button>
          </div>
        ))}
    </div>
  );
}