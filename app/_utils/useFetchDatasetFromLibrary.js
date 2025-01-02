import {
  useDataStore,
  useTabStore,
} from "./zustand/tablestore";

// Separate API request handling
const useFetchDatasetFromLibrary = () => {
  const { setErrorMessage, setApplicationStatus } = useDataStore();

  const { tabs, currentTab, addTab } = useTabStore();

  const fetchDatasetFromLibrary = async (datasetOID) => {
    if (tabs.hasOwnProperty(datasetOID)) {
      // table already exists
      // setCurrentTab(row.datasetOID);
      return true;
    } else {
      if (!navigator.onLine) {
        setErrorMessage(
          "No internet connection. Please connect and try again."
        );
        return false;
      }

      // Make the API request
      const time = new Date().getTime();
      const request = tabs[currentTab].dataSource + `/${datasetOID}`;
      setApplicationStatus(`[${datasetOID}]: Fetching New Dataset`);
      return fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if(data === false) {
            return false;
          }
          // This block only executes if response.ok was true
          console.log(data);
          addTab(datasetOID, data, request, "dataset", "api");
          setApplicationStatus(`[${datasetOID}]: Successfully fetched dataset `);
          return true;
        })
        .catch((error) => {
          setErrorMessage(`[${datasetOID}]: `  + error.message);
          setApplicationStatus(`[${datasetOID}]: `  + error.message);
          return false;
        });
    }
  };

  return {
    fetchDatasetFromLibrary,
  };
};

export default useFetchDatasetFromLibrary;
