import React, { useEffect, useRef } from "react";
import { useTabStore } from "../../_utils/zustand/tablestore";

const Table = () => {
  const { tabs, currentTab } = useTabStore();
  const tableRef = useRef(null);

  const handleHeaderClick = (columnIndex) => {
    // Implement your header click logic here (e.g., sorting)
    console.log(`Header clicked at index: ${columnIndex}`);
  };

  // Check if the table exists before rendering
  const config = tabs[currentTab];
  const dataset = tabs[currentTab].dataset;
  if (!dataset) return null;

  return (
    <table className="bg-white" ref={tableRef}>
      <thead>
        <tr>
          {dataset.columns.map((column, index) => (
            <th
              key={index}
              onClick={() => handleHeaderClick(index)}
              data-tooltip={`Label: ${column.label}\nDataType: ${
                column.dataType
              }\nLength: ${column.length || "N/A"}\nKey Sequence: ${
                column.keySequence || "None"
              }`}
              className={column.keySequence ? "key-sequence" : ""}
            >
              {config.useLabels ? column.label : column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataset.rows
          .slice((config.offset) * config.rowsPerPage, config.offset+1 *  config.rowsPerPage)
          .map((row, rowIndex) => (
            <tr key={rowIndex}>
              {dataset.columns.map((col, colIndex) => (
                console.log(dataset.rows),
                console.log(dataset.columns),
                <td key={colIndex}>{row[colIndex] || "N/A"}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
/*
<table className="bg-white" ref={tableRef}>
              <thead>
                <tr>
                  {visibleColumns.map((column, index) => (
                    <th
                      key={index}
                      onClick={() => handleHeaderClick(index)}
                      data-tooltip={`Label: ${column.label}\nDataType: ${
                        column.dataType
                      }\nLength: ${column.length || "N/A"}\nKey Sequence: ${
                        column.keySequence || "None"
                      }`}
                      className={column.keySequence ? "key-sequence" : ""}
                    >
                      {useLabels ? column.label : column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataset.rows
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage
                  )
                  .map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {visibleColumns.map((col, colIndex) => (
                        <td key={colIndex}>{row[colIndex] || "N/A"}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
*/
