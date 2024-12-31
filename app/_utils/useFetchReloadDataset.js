import { useDataStore, useTabStore } from "./zustand/tablestore";

const useFetchReloadDataset = () => {
  const { 
    apiURL,
    setErrorMessage,
    setApplicationStatus,
  } = useDataStore();

  const {
    tabs,
    setDataset,
    currentTab
  } = useTabStore();

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
  
    const request = `${apiURL}/${tab.datasetOID}?${queryString}`;
  
    setApplicationStatus("Making API Request...");
    fetch(request)
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setApplicationStatus("Api Request Successful");
        console.log(data);
        setDataset(tab.datasetOID, data);
        return true;
      })
      .catch((error) => {
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