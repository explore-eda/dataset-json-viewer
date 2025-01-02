import React, { useState, useEffect } from "react";
import { useTabStore } from "../../_utils/zustand/tablestore";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function FilteringOverlay({ showOverlay, setShowOverlay }) {
  const { fetchReloadDataset } = useFetchReloadDataset();
  const { currentTab, tabs, updateFiltering } = useTabStore();

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [columnValues, setColumnValues] = useState([]);

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  const data = tabs[currentTab]?.dataset;
  const columns = data?.columns;
  const rows = data?.rows;
  const activeFilters = tabs[currentTab]?.activeFilters || [];

  const applyFilter = () => {
    let newFilter = {};
    if (selectedFilter === "sort-a-z") {
      newFilter = {
        column: selectedColumn,
        type: "sort",
        order: "asc",
      };
    } else if (selectedFilter === "sort-z-a") {
      newFilter = {
        column: selectedColumn,
        type: "sort",
        order: "desc",
      };
    } else if (selectedFilter === "select-by-value") {
      newFilter = {
        column: selectedColumn,
        type: "value",
        value: filterValue,
      };
    } else if (selectedFilter === "select-by-condition") {
      // Implement your condition logic here
      newFilter = {
        column: selectedColumn,
        type: "condition",
        condition: "equals", // Replace with your actual condition
        value: filterValue,
      };
    }

    setShowOverlay(false);
  };

  const handleColumnChange = (event) => {
    const columnValue = event.target.value.toLowerCase();
    setSelectedColumn(columnValue);
    const columnValues = rows.map((row) => row[columnValue]);
    setColumnValues([...new Set(columnValues)]);
    setSelectedFilter(""); // Reset filter when column changes
    setFilterValue("");
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    setFilterValue("");
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    showOverlay && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-20 rounded-md relative w-96"> {/* Added width for better layout */}
          <button
            className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 rounded-full p-1 hover:bg-slate-200"
            onClick={handleOverlayClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h2>Filtering Options</h2>
          <div className="mb-4"> {/* Added margin for spacing */}
            <label htmlFor="column-select">Select Column:</label>
            <select
              id="column-select"
              value={selectedColumn}
              onChange={handleColumnChange}
            >
              <option value="">Select a column</option>
              {columns?.map((column, index) => (
                <option key={index} value={column.name}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>

          {selectedColumn && (
            <div className="mb-4">
              <label htmlFor="filter-select">Select Filter:</label>
              <select
                id="filter-select"
                value={selectedFilter}
                onChange={handleFilterChange}
              >
                <option value="">Select a filter</option>
                <option value="sort-a-z">Sort A to Z</option>
                <option value="sort-z-a">Sort Z to A</option>
                <option value="select-by-value">Select by Value</option>
                <option value="select-by-condition">
                  Select by Condition
                </option>
              </select>
            </div>
          )}

          {/* Input for filter value */}
          {(selectedFilter === "select-by-value" ||
            selectedFilter === "select-by-condition") && (
            <div className="mb-4">
              {selectedFilter === "select-by-value" ? (
                <div>
                  <label htmlFor="filter-value">Select Value:</label>
                  <select
                    id="filter-value"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                  >
                    <option value="">Select a value</option>
                    {columnValues.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label htmlFor="filter-value">Enter Value:</label>
                  <input
                    type="text"
                    id="filter-value"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* Apply Filter button */}
          <button
            onClick={applyFilter}
            disabled={!selectedColumn || !selectedFilter || !filterValue}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply Filter
          </button>

          {/* Active Filters display */}
          <div className="mt-4"> {/* Added margin for spacing */}
            <h3>Active Filters:</h3>
            <ul>
              {activeFilters.map((filter, index) => (
                <li key={index}>
                  {filter.column} - {filter.type} -{" "}
                  {filter.order || filter.value || filter.condition}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  );
}
