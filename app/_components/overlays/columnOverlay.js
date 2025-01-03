import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
export default function ColumnOverlay({
  setShowOverlay,
  tab,
  errorToast,
  handleUpdate,
}) {

  useEffect(() => {
    if (!tab || tab?.type === "library") {
      errorToast("Please Select a Valid Table");
      setShowOverlay(false);
    }
  }, []);

  const columns = tab?.dataset.columns;
  const currVisibleColumns = tab?.visibleColumns;
  const [selectedColumns, setSelectedColumns] = useState(
    currVisibleColumns?.map((column) => column.label)
  );

  const [useLabels, setUseLabels] = useState(tab?.useLabels);

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  const handleOverlaySave = () => {
    const newColumns = columns.filter((column) =>
      selectedColumns.includes(column.label)
    );

    handleUpdate(newColumns, useLabels);

    setShowOverlay(false);
  };

  const handleColumnSelect = (columnName) => {
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };

  const handleUseLabelsChange = () => {
    setUseLabels(!useLabels);
  };

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
          <h2 className="text-xl font-bold mb-4">Column Configuration</h2>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="mb-4 w-full">
              <label
                htmlFor="apiAddress"
                className="block text-gray-700 font-bold mb-2"
              >
                Visible Columns:
              </label>
              <div className="space-y-2">
                {columns &&
                  columns.map((column) => (
                    <div
                      key={column.label}
                      className="flex items-center justify-between"
                    >
                      <label
                        htmlFor={`column-${column.label}`}
                        className="mr-2 cursor-pointer"
                      >
                        {column.label}
                      </label>
                      <input
                        type="checkbox"
                        id={`column-${column.label}`}
                        checked={selectedColumns.includes(column.label)}
                        onChange={() => handleColumnSelect(column.label)}
                        className="rounded border-gray-300"
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="apiAddress"
                className="block text-gray-700 font-bold mb-2"
              >
                Options:
              </label>
              <label htmlFor="useLabels">
                Use Column Labels
                <input
                  type="checkbox"
                  id="useLabels"
                  checked={useLabels}
                  onChange={handleUseLabelsChange}
                  className="rounded border-gray-300 ml-2"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="self-end bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={() => handleOverlaySave()}
            >
              Update Columns
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
