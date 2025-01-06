import React from "react";
import "./workspace.css";
import Table from "../_components/table/table";
import LibraryView from "../_components/table/libraryview";
import { useEffect, useRef } from "react";
import { useDataStore } from "../_utils/zustand/tablestore";

const WorkSpace = ({tab, handleDatasetFromLibrary, setDataset, updateDisplayApi, updateTotal, parseNDJSON, getExtension }) => {
  const { setErrorMessage, setApplicationStatus } = useDataStore();
  const tableType = tab?.type;

  useEffect(() => {
    if(!(tab?.type === "library") && !(tab?.sourceType === "local")) {
      fetchReloadDataset();
    }
  }, [tab?.limit, tab?.page, tab?.sortFilters, tab?.rowQuery]);

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
  
    if (tab.rowQuery) {
      queryString += `filter=${tab.rowQuery}&`;
    }
  
    if (tab.sortFilters.length > 0) {
      const sortParams = tab.sortFilters.map(sort => `${sort}`).join(',');
      queryString += `sort=${sortParams}&`; 
    }
  
    if (tab.paginationActive) {
      console.log("paginationActive", tab);
      
      const offset = tab.page*tab.limit;
      queryString += `offset=${offset}&limit=${tab.limit}`;
    }
  
    const request = `${tab.dataSource}?${queryString}`;

    abortControllerRef.current.abort(); 
    abortControllerRef.current = new AbortController();

    const requestId = Date.now();

    console.log("requestId", request);
  
    setApplicationStatus(`${requestId}: New API Request: ${queryString}`);
    fetch(request, { signal: abortControllerRef.current.signal }) 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (tab.extension === "ndjson") {
          console.log("response", response);
          return response.text().then(parseNDJSON);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setApplicationStatus(`${requestId}: Api Request Was Successful! `);
        setDataset(tab.tabUUID, data);
        updateDisplayApi(tab.tabUUID, request);
        updateTotal(tab.tabUUID, data.pagination.total);
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

  const extension = tab?.extension;

  if(tableType === "library") {
    return (
      <main className="h-full w-full shadow-inner overflow-hidden overflow-x-auto">
        <div className="h-full px-5 overflow-auto overflow-x-auto">
          <LibraryView tab={tab} handleDatasetFromLibrary={handleDatasetFromLibrary}/>
        </div>
      </main>
    );
  }

  
  if(tableType === "dataset") {
    return (
      <main className="h-full  shadow-inner overflow-hidden">
        <div className="h-full px-5 overflow-auto max-h-[calc(80vh-110px)]">
          <Table tab={tab} />
        </div>
      </main>
    );
  }


  return (
    <main className="h-full w-full shadow-inner overflow-hidden overflow-x-auto">
     </main>
  );
};

export default WorkSpace;