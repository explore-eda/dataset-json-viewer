import { useDataStore, useTabStore } from "./zustand/tablestore";

import useParseNDJSON from "./useParseNDJSON";
import useGetExtension from "./useGetExtension";

// Separate API request handling
const useFetchTableFromLibrary = () => {
  const { setApplicationStatus, setErrorMessage } = useDataStore();
  const { parseNDJSON } = useParseNDJSON();
  const { getExtension } = useGetExtension();

  const fetchTableFromLibrary = (datasetOID, tabs, currentTab, addTab, setCurrentTab, setApplicationStatus, errorToast) => {
        if (tabs.hasOwnProperty(datasetOID)) {
          return true;
        } else {
          if (!navigator.onLine) {
            errorToast("No internet connection. Please connect and try again.");
            return false;
          }
    
          const extension = getExtension(datasetOID);
          if(extension !== "json" && extension !== "ndjson") {
            errorToast("Unsupported file format");
            return false;
          }
          // Make the API request
          const request = tabs[currentTab].dataSource + `/${datasetOID}`;
          setApplicationStatus(`[${datasetOID}]: Fetching New Dataset`);
          return fetch(request)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const extension = getExtension(request);
              if (extension === "ndjson") {
                return response.text().then(parseNDJSON);
              } else {
                return response.json();
              }
            })
            .then((data) => {
              if (data === false) {
                return false;
              }
              // This block only executes if response.ok was true
              const tabUUID = addTab(
                datasetOID,
                data,
                request,
                "dataset",
                "api",
                getExtension(datasetOID)
              );
              setApplicationStatus(
                `[${datasetOID}]: Successfully fetched dataset `
              );
              return tabUUID;
            })
            .catch((error) => {
              errorToast(`[${datasetOID}]: ` + error.message);
              setApplicationStatus(`[${datasetOID}]: ` + error.message);
              return false;
            });
        }
  };
  return { fetchTableFromLibrary };
};

export default useFetchTableFromLibrary;
