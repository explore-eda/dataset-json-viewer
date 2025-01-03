import { useDataStore, useTabStore } from "./zustand/tablestore";

// Separate API request handling
const useOpenFileDatabase = () => {
  const { 
    setApplicationStatus,
    setErrorMessage,
  } = useDataStore();

  const openFileDataset = (file) => {
    setApplicationStatus("File Opening....");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        addTab(file.name, jsonData, "C:"+file.name, "dataset", "local");
        setCurrentTab(file.name);

        setApplicationStatus("Opened File");
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    reader.onerror = (error) => {
        setApplicationStatus("Error Opening File");
        setErrorMessage(error.message);
    };

    reader.readAsText(file);
  };

  return {
    openFileDataset,
  };
};

export default useOpenFileDatabase;