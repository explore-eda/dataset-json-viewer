import { useDataStore, useTabStore, useLibraryTableStore } from "./zustand/tablestore";

const useHandleClear = () => {
  const { resetDataStore } = useDataStore();
  const { resetTabStore } = useTabStore();
  const { resetLibraryTableStore } = useLibraryTableStore();

  const handleClear = () => {
    resetDataStore();
    resetTabStore();
    resetLibraryTableStore();
  };

  return { handleClear };
};

export default useHandleClear;