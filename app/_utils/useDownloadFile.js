import { useDataStore, useTabStore } from "./zustand/tablestore";

import useParseNDJSON from "./useParseNDJSON";
import useGetExtension from "./useGetExtension";

// Separate API request handling
const useDownloadFile = () => {
  const { setApplicationStatus, setErrorMessage } = useDataStore();
  const { parseNDJSON } = useParseNDJSON();
  const { getExtension } = useGetExtension();

  const downloadFile = (tabs, currentTab, errorToast) => {
    if (!currentTab) {
      errorToast("No data to download");
      return;
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(tabs[currentTab].dataset)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    if (tabs[currentTab].sourceType === "api") {
      const urlParts = tabs[currentTab].dataSource.split("/");
      link.download = urlParts[urlParts.length - 1];
    } else {
      link.download = tabs[currentTab].dataSource;
    }
    link.click();
  };
  return { downloadFile };
};

export default useDownloadFile;
