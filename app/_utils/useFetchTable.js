import { useDataStore } from "./zustand/tablestore";
import useParseNDJSON from "./useParseNDJSON";
import useGetExtension from "./useGetExtension";

// Separate API request handling
const useFetchTable = () => {
  const { 
    setApplicationStatus,
    setErrorMessage,
  } = useDataStore();


  const { parseNDJSON } = useParseNDJSON();
  const { getExtension } = useGetExtension();


  const fetchTable = (url, selectedStudy, selectedData, initFilters, addTab, setCurrentTab, setApplicationStatus, errorToast) => {
    if (url === "" || selectedStudy == "") return;
    if (!navigator.onLine) {
      errorToast("No internet connection. Please connect and try again.");
      return false;
    }

    let request =
      url + "/studies/" + selectedStudy + "/datasets" + "/" + selectedData;

      if(initFilters.length > 0) {
        request += "?";

      if (initFilters?.rowQuery) {
        request += `filter=${tab.rowQuery}&`;
      }
    
      if (initFilters?.sortColumns.length > 0) {
        const sortParams = initFilters.sortColumns.map(sort => `${sort}`).join(',');
        request += `sort=${sortParams}&`; 
      }
    
      if (initFilters?.rowsPerPage) {        
        request += `offset=${0}&limit=${initFilters.rowsPerPage}`;
      }
    }

    setApplicationStatus(
      `[${selectedData ?? selectedStudy}] Fetching New Table`
    );
    

    return fetch(request)
      .then((response) => {
        if (!response.ok) {
          setApplicationStatus(
            `[${selectedData ?? selectedStudy}] Failed to fetch new table `
          );
          errorToast(response.status);
          return false;
        }
        const extension = getExtension(request);
        if (extension === "ndjson") {
          return response.text().then(parseNDJSON);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (selectedData) {
          const tabUUID = addTab(
            selectedData,
            data,
            request,
            "dataset",
            "api",
            getExtension(selectedData),
            initFilters,
          );
          setCurrentTab(tabUUID);

          setApplicationStatus(
            `[${selectedData}] Successfully fetched Dataset Table `
          );
          return true;
        } else {
          const tabUUID = addTab(
            selectedStudy,
            data,
            request,
            "library",
            "api",
            getExtension(selectedStudy),
          );
          setCurrentTab(tabUUID);

          setApplicationStatus(
            `[${selectedStudy}] Successfully fetched Library Table `
          );
          return true;
        }
      })
      .catch((error) => {
        setApplicationStatus("Failed to fetch table: " + request);
        errorToast(error.message);

        return false;
      });
  };

  return {
    fetchTable,
  };
};

export default useFetchTable;