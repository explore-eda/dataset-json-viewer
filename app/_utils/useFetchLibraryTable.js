import { useDataStore, useTabStore, useLibraryTableStore } from "./zustand/tablestore";
import useHandleClear from './useHandleClear'; 

// Separate API request handling
const useFetchLibraryTable = () => {
  const { 
    apiURL,
    setApiURL,
    fileName,
    setFileName,
    applicationStatus,
    setApplicationStatus,
    dataset,
    setErrorMessage,
    datasetExtension,
  } = useDataStore();

  const {
    setTabListActive,
  } = useTabStore();

  const {
    setLibraryTable,
    setLibraryTableActive,
  } = useLibraryTableStore();

  const { handleClear } = useHandleClear();

  const fetchLibraryTable = (url) => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection. Please connect and try again.");
      return false;
    }

    if (url === "") return;
    setApplicationStatus("Fetching new API....");

    fetch(url)
      .then((response) => {
        if (!response.ok) {
            setErrorMessage(response.status);
            return false;
        }
        return response.json();
      })
      .then((data) => {
        handleClear(); 
        
        setLibraryTable(data);
        setLibraryTableActive(true);
        setTabListActive(true);
        
        setApiURL(url);
        setApplicationStatus("API Request Successful");
        return true;
      })
      .catch((error) => {
        setApplicationStatus("Initializing.. ");
        setErrorMessage(error.message);
        return false;
      });
  };

  return {
    fetchLibraryTable,
  };
};

export default useFetchLibraryTable;