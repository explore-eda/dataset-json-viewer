import React, { useState, useEffect } from "react";
import { useTabStore, useLibraryTableStore, useDataStore } from "../../_utils/zustand/tablestore";
import useFetchNewDataset from '../../_utils/useFetchNewDataset'; 

function LibraryView() {
  const { fetchNewDataset } = useFetchNewDataset(); 
  const { libraryTable } = useLibraryTableStore();

  const columns = Object.keys(libraryTable[0] || {});

  const handleClick = (row) => {
    fetchNewDataset(row);
  };

  return (
    <div className="flex flex-col w-full overflow-auto rounded shadow-md">
      <div className="-mx-1 overflow-x-auto sm:-mx-2">
        <table className="min-w-full w-full table-auto divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-2 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {libraryTable.map((row) => (
              <tr key={row.datasetOID} className="hover:bg-gray-100" onClick={() => handleClick(row)}>
                {columns.map((column) => (
                  <td key={`${row.datasetOID}-${column}`} className="px-4 py-2">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LibraryView;
