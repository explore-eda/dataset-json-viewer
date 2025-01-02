import { useDataStore, useTabStore } from "./zustand/tablestore";

const useHandleClear = () => {
  const { resetDataStore } = useDataStore();
  const { resetTabStore } = useTabStore();

  const handleClear = () => {
    resetDataStore();
    resetTabStore();
  };

  return { handleClear };
};

export default useHandleClear;