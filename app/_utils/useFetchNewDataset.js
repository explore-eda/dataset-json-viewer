import { useDataStore, useTabStore, useLibraryTableStore } from "./zustand/tablestore";

// Separate API request handling
const useFetchNewDataset = () => {
  const { 
    setErrorMessage,
  } = useDataStore();

  const {
    tabs,
    addTab,
    setCurrentTab,
  } = useTabStore();

  const {
    libraryURL,
    setLibraryTableActive,
  } = useLibraryTableStore();

  const fetchNewDataset = (row) => {
    if (tabs.hasOwnProperty(row.datasetOID)) {
        // table already exists
        setCurrentTab(row.datasetOID);
        setLibraryTableActive(false);
      } else {
        if (!navigator.onLine) {
          setErrorMessage("No internet connection. Please connect and try again.");
          return false;
        }

        // Make the API request
        fetch(libraryURL + `/${row.datasetOID}/`)
          .then((response) => {
            if (!response.ok) {
              setErrorMessage("Network response was not ok");
              return false;
            }
            return response.json();
          })
          .then((data) => {
            const fileExtension = row.datasetOID.split('.').pop();
            addTab(row.datasetOID, data, fileExtension);
            setCurrentTab(row.datasetOID);
            setLibraryTableActive(false);
            return true;
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
            return false;
          });
        }
  };

  return {
    fetchNewDataset,
  };
};

export default useFetchNewDataset;