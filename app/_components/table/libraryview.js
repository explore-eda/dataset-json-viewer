import React from "react";
import { useTabStore} from "../../_utils/zustand/tablestore";
import useFetchDatasetFromLibrary from '../../_utils/useFetchDatasetFromLibrary'; 

function LibraryView() {
  const { fetchDatasetFromLibrary } = useFetchDatasetFromLibrary(); 
  const {tabs, currentTab, setCurrentTab} = useTabStore();

  const columns = Object.keys(tabs[currentTab].dataset[0] || {});
  const libraryTable = tabs[currentTab].dataset;

  const handleClick = async (event, row) => {
    if (event.shiftKey) { 
      event.preventDefault(); 
      const value = await fetchDatasetFromLibrary(row.datasetOID); 
  
    } else {
      const value = await fetchDatasetFromLibrary(row.datasetOID); 
  
      if (value) {
        setCurrentTab(row.datasetOID); 
      }
    }
  };

  return (
    <div className="flex flex-col w-full overflow-auto rounded shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full w-full table-auto divide-y divide-gray-200 mb-5">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column} 
                  className="px-6 py-3 text-left font-bold tracking-wider" 
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {libraryTable.map((row) => (
              <tr 
                key={row.datasetOID} 
                className="hover:bg-gray-100 cursor-pointer"
                onClick={(event) => handleClick(event, row)}
              >
                {columns.map((column) => (
                  <td key={`${row.datasetOID}-${column}`} className="px-6 py-4 whitespace-nowrap"> 
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
