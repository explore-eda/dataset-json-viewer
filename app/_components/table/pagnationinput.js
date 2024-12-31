import React, { useEffect } from 'react'; 
import { useTabStore } from "../../_utils/zustand/tablestore";

export default function Pagination() {
    const { 
        currentTab, 
        tabs,
        updatePageNumbers,
      } = useTabStore(); 

    const handleRowsPerPageChange = (event) => {
        updatePageNumbers(currentTab, event.target.value);
    };

    return (
        <div>
            <label htmlFor="rowsPerPageInput">Rows per page:</label>
            <input
            type="number"
            id="rowsPerPageInput"
          value={tabs[currentTab]?.rowsPerPage}
          min="1"
          onChange={handleRowsPerPageChange}
          className="w-16 ml-2 border-2 border-gray-400 rounded-md"
        />
        </div>
    )
}