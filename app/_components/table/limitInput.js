import React, { useEffect } from "react";
import { useTabStore } from "../../_utils/zustand/tablestore";
import useFetchReloadDataset from "../../_utils/useFetchReloadDataset";

export default function LimitInput() {
  const { fetchReloadDataset } = useFetchReloadDataset();

  const { currentTab, tabs, updateLimit } = useTabStore();

  const handleLimitChange = (event) => {
    if(event.target.value < 1 || event.target.value === "") return;
    updateLimit(currentTab, event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => { 
      await fetchReloadDataset();
    };
  
    fetchData(); // Call the async function
  }, [tabs[currentTab].limit]);

  return (
    <div>
      <label htmlFor="rowsPerPageInput">Rows per page:</label>
      <input
        type="number"
        id="limitInput"
        min={1}
        value={tabs[currentTab]?.limit}
        onChange={handleLimitChange}
        className="w-16 ml-2 border-2 border-gray-400 rounded-md"
      />
    </div>
  );
}
