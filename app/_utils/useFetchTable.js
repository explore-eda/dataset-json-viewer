import { useDataStore, useTabStore } from "./zustand/tablestore";

// Separate API request handling
const useFetchTable = () => {
  const { 
    setApplicationStatus,
    setErrorMessage,
  } = useDataStore();

  const {
    addTab,
    setCurrentTab,
  } = useTabStore();

  const fetchTable = (url, slectedStudy) => {
    if (url === "" || slectedStudy == "") return;
    if (!navigator.onLine) {
      setErrorMessage("No internet connection. Please connect and try again.");
      return false;
    }

    const request = url + "/studies/" + slectedStudy + "/datasets";
    setApplicationStatus("Fetching New Table: " + request);
    return fetch(request)
      .then((response) => {
        if (!response.ok) {
            setApplicationStatus("Failed to fetch new table: " + request);
            setErrorMessage(response.status);
            return false;
        }
        return response.json();
      })
      .then((data) => {
        addTab(slectedStudy, data, request, "library", "api");
        setCurrentTab(slectedStudy);
        
        setApplicationStatus("Successfully fetched table: " + request);
        return true;
      })
      .catch((error) => {
        setApplicationStatus("Failed to fetch table: " + request);
        setErrorMessage(error.message);
        return false;
      });
  };

  return {
    fetchTable,
  };
};

export default useFetchTable;