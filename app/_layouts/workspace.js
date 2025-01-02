import React from "react";
import "./workspace.css";
import LimitInput from "../_components/table/limitInput";
import Table from "../_components/table/table";
import LibraryView from "../_components/table/libraryview";
import TabList from "../_components/table/tablist";
import { useTabStore } from "../_utils/zustand/tablestore";



const WorkSpace = () => {
  const { 
    tabs,
    currentTab,
  } = useTabStore(); 

  const tableType = tabs[currentTab]?.type;

  if(tableType === "library") {
    return (
      <main className="background h-full w-full shadow-inner relative overflow-hidden">
        <div className="px-5 overflow-auto h-full">
          <TabList /> 
          <LibraryView />
        </div>
      </main>
    );
  }


  
  if(tableType === "dataset") {
    return (
      <main className="background h-full w-full shadow-inner relative overflow-hidden">
        <div className="px-5 overflow-auto h-full">
          <TabList /> 
          <LimitInput />
          <Table />
        </div>
      </main>
    );
  }

  return (
    <main className="background h-full w-full shadow-inner relative overflow-hidden">
          <TabList /> 
     </main>
  );
};

export default WorkSpace;