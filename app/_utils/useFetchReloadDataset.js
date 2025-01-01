import { useDataStore, useTabStore, useLibraryTableStore } from "./zustand/tablestore";
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

  const {
    libraryURL
  } = useLibraryTableStore();

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
  
    if (tab.sortingActive) {
      queryString += `sort=${tab.sortField}:${tab.sortOrder}&`;
    }
  
    if (tab.paginationActive) {
      const offset = tab.page*tab.limit;
      queryString += `offset=${offset}&limit=${tab.limit}`;
    }
  
    const request = `${libraryURL}/${tab.datasetOID}?${queryString}`;

    abortControllerRef.current.abort(); 
    abortControllerRef.current = new AbortController(); // Create a new AbortController

    const requestId = Date.now();
  
    setApplicationStatus(`${requestId}: New API Request: ${request}`);
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
          return; 
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