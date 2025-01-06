import { useDataStore, useTabStore } from "./zustand/tablestore";

import useParseNDJSON from "./useParseNDJSON";
import useGetExtension from "./useGetExtension";


// Separate API request handling
const useOpenFile = () => {
  const { setApplicationStatus, setErrorMessage } = useDataStore();
  const { parseNDJSON } = useParseNDJSON();
  const { getExtension } = useGetExtension();


  const openFile = (file, addTab, setCurrentTab, setApplicationStatus, errorToast) => {
    // Handle File Open
    setApplicationStatus("File Opening....");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const extention = getExtension(file.name);
        let jsonData;
        if (extention === "ndjson") {
          jsonData = parseNDJSON(e.target.result);
        } else {
          jsonData = JSON.parse(e.target.result);
        }
        const tabUUID = addTab(
          file.name,
          jsonData,
          file.name,
          "dataset",
          "local",
          getExtension(file.name)
        );
        setCurrentTab(tabUUID);
        setApplicationStatus("Opened File");
      } catch (error) {
        errorToast(error.message);
      }
    };

    reader.onerror = (error) => {
      setApplicationStatus("Error Opening File");
      errorToast(error.message);
    };

    reader.readAsText(file);
  };
  return ({ openFile });
};

export default useOpenFile;
