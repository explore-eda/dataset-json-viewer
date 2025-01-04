import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function SortOverlay({
  tab,
  setShowOverlay,
  errorToast,
  handleUpdate,
}) {
  const [columns, setColumns] = useState(
    tab?.dataset.columns?.map((column) => column.name) || []
  );

  const [sortFilters, setSortedColumns] = useState(tab?.sortFilters || []);

  const [columnsDirections, setColumnsDirections] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col]: "asc" }), {})
  );

  const handleColumnSelect = (columnName) => {
    const currentDirection = columnsDirections[columnName];
    const newDirection = currentDirection === "asc" ? "desc" : "asc";
    setColumnsDirections({ ...columnsDirections, [columnName]: newDirection });

    const existingSort = sortFilters.find((s) => s.startsWith(columnName));

    if (existingSort) {
      // If it exists, update the direction
      setSortedColumns(
        sortFilters.map((s) =>
          s === existingSort ? `${columnName}:${newDirection}` : s
        )
      );
    } else {
      // If it doesn't exist, add a new sort filter with the new direction
      setSortedColumns([...sortFilters, `${columnName}:${newDirection}`]);
    }
  };

  const removeSort = (columnName) => {
    setSortedColumns(sortFilters.filter((s) => !s.startsWith(columnName)));
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  const handleOverlaySave = () => {
    handleUpdate(sortFilters);
    setShowOverlay(false);
  };

  useEffect(() => {
    if (!tab || tab?.type === "library") {
      errorToast("Please Select a Valid Table");
      setShowOverlay(false);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-16 rounded-md relative">
        <button
          className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 rounded-full p-1 hover:bg-slate-200"
          onClick={handleOverlayClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4">Sort Selection</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="mb-4 md:min-w-96">
              <label
                htmlFor="apiAddress"
                className=" text-gray-700 font-bold mb-2"
              >
                Sort by Column:
              </label>
              <div className="space-y-2 grid grid-cols-2">
                {columns &&
                  columns.map((column) => (
                    <button
                      key={column}
                      className={`flex justify-center px-8 py-2 rounded-m bg-gray-100 hover:bg-blue-500 hover:text-white'}`}
                      onClick={() => handleColumnSelect(column)}
                    >
                      {column}
                      {sortFilters
                        .find((s) => s.startsWith(column))
                        ?.split(":")[1] === "asc"
                        ? " ▲"
                        : " ▼"}
                    </button>
                  ))}
              </div>
            </div>
            <div className="md:min-w-96">
              <label
                htmlFor="apiAddress"
                className="block text-gray-700 font-bold mb-2"
              >
                Active Filters:
              </label>
              <ul className="space-y-2 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
                {sortFilters.map((sort) => (
                  <li key={sort} className="flex px-4 py-0.5 items-center justify-between">
                    {sort.replace(":", ":")}
                    <button
                      className="text-xs ml-2"
                      onClick={() => removeSort(sort.split(":")[0])}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="self-end bg-custom-blue hover:bg-blue-900 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={() => handleOverlaySave()}
            >
              Update Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
