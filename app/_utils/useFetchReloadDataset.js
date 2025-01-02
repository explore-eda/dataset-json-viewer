import { useDataStore, useTabStore } from "./zustand/tablestore";
import { useRef } from "react";

const useFetchReloadDataset = () => {
  const { 
    setErrorMessage,
    setApplicationStatus,
  } = useDataStore();

  const {
    tabs,
    setDataset,
    currentTab
  } = useTabStore();

  const abortControllerRef = useRef(new AbortController());

  const fetchReloadDataset = () => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection. Please connect and try again.");
      return false;
    }

    if(!tabs[currentTab]) {
      return false;
    }

    const tab = tabs[currentTab];
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
  
    const request = `${tabs[currentTab].dataSource}?${queryString}`;

    abortControllerRef.current.abort(); 
    abortControllerRef.current = new AbortController(); // Create a new AbortController

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

  return {
    fetchReloadDataset,
  };
};

export default useFetchReloadDataset;