import { useDataStore, useTabStore, useLibraryTableStore } from "./zustand/tablestore";

// Separate API request handling
const useFetchNewDataset = () => {
  const { 
    apiURL,
  } = useDataStore();

  const {
    tabs,
    addTab,
    setCurrentTab,
  } = useTabStore();

  const {
    setLibraryTableActive,
  } = useLibraryTableStore();

  const fetchNewDataset = (row) => {
    if (tabs.hasOwnProperty(row.datasetOID)) {
        // table already exists
        setCurrentTab(row.datasetOID);
        setLibraryTableActive(false);
      } else {
        console.log(apiURL + `/${row.datasetOID}/`);
        // Make the API request
        fetch(apiURL + `/${row.datasetOID}/`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            const fileExtension = row.datasetOID.split('.').pop();
            addTab(row.datasetOID, data, fileExtension);
            setCurrentTab(row.datasetOID);
            setLibraryTableActive(false);
            console.log(data);
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
          });
        }
  };

  return {
    fetchNewDataset,
  };
};

export default useFetchNewDataset;