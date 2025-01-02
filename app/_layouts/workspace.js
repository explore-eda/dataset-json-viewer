import React from "react";
import "./workspace.css";
import LimitInput from "../_components/table/limitInput";
import Table from "../_components/table/table";
import LibraryView from "../_components/table/libraryview";
import { useEffect, useRef } from "react";
import { useDataStore } from "../_utils/zustand/tablestore";

const WorkSpace = ({tab, handleDatasetFromLibrary, setDataset}) => {
  const { setErrorMessage, setApplicationStatus } = useDataStore();
  const tableType = tab?.type;

  useEffect(() => {
    if(!(tab?.type === "library")) {
      fetchReloadDataset();
    }
  }, [tab?.limit, tab?.page, tab?.sortModel, tab?.filteringActive, tab?.filter]);

  const abortControllerRef = useRef(new AbortController());

  const fetchReloadDataset = () => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection. Please connect and try again.");
      return false;
    }

    if(!tab) {
      return false;
    }

    let queryString = "";
  
    if (tab.filteringActive) {
      queryString += `filter=${tab.filter}&`;
    }
  
    if (tab.sortModel.length > 0) {
      const sortParams = tab.sortModel.map(sort => `${sort.colId}:${sort.sort}`).join(',');
      queryString += `sort=${sortParams}&`; 
    }
  
    if (tab.paginationActive) {
      const offset = tab.page*tab.limit;
      queryString += `offset=${offset}&limit=${tab.limit}`;
    }
  
    const request = `${tab.dataSource}?${queryString}`;

    abortControllerRef.current.abort(); 
    abortControllerRef.current = new AbortController();

    const requestId = Date.now();
  
    setApplicationStatus(`${requestId}: New API Request: ${queryString}`);
    fetch(request, { signal: abortControllerRef.current.signal }) 
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setApplicationStatus(`${requestId}: Api Request Was Successful! `);
        setDataset(tab.datasetOID, data);
        return true;
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          setApplicationStatus(`${requestId}: Api Request Was Aborted! `);
          return false; 
        }
        setErrorMessage("There has been a problem with your fetch operation:",
          error
        );
        return false;
      });
  };

  console.log("tableType", tab);

  if(tableType === "library") {
    return (
      <main className="h-full w-full shadow-inner overflow-hidden">
        <div className="px-5 overflow-auto h-full">
          <LibraryView tab={tab} handleDatasetFromLibrary={handleDatasetFromLibrary}/>
        </div>
      </main>
    );
  }
  
  if(tableType === "dataset") {
    return (
      <main className="h-full w-full shadow-inner overflow-hidden">
        <div className="px-5 overflow-auto h-full">
          <Table tab={tab} />
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full shadow-inner overflow-hidden">
     </main>
  );
};

export default WorkSpace;