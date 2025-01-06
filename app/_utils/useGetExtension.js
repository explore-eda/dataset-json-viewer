import { useDataStore } from "./zustand/tablestore";

// Separate API request handling
const useGetExtension = () => {
  const { 
    setApplicationStatus,
    setErrorMessage,
  } = useDataStore();

  const getExtension = (data) => {
    return data.split(".").pop();
  };

  return {
    getExtension,
  };
};

export default useGetExtension;