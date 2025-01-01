import { useDataStore, useTabStore, useLibraryTableStore } from "./zustand/tablestore";
import useHandleClear from './useHandleClear'; 

// Separate API request handling
const useFetchLibraryTable = () => {
  const { 
    setApplicationStatus,
    setErrorMessage,
  } = useDataStore();

  const {
    setTabListActive,
  } = useTabStore();

  const {
    setLibraryURL,
    setLibraryTable,
    setLibraryTableActive,
  } = useLibraryTableStore();

  const { handleClear } = useHandleClear();

  const fetchLibraryTable = (url) => {
    if (url === "") return;
    if (!navigator.onLine) {
      setErrorMessage("No internet connection. Please connect and try again.");
      return false;
    }

    setApplicationStatus("Fetching Library Table: " + url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
            setApplicationStatus("Failed to fetch library table: " + url);
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
        
        setLibraryURL(url);
        setApplicationStatus("Successfully fetched library table: " + url);
        return true;
      })
      .catch((error) => {
        setApplicationStatus("Failed to fetch library table: " + url);
        setErrorMessage(error.message);
        return false;
      });
  };

  return {
    fetchLibraryTable,
  };
};

export default useFetchLibraryTable;