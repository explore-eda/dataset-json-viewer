import React, { useEffect, useRef, useState } from "react";
import { useTabStore } from "../../_utils/zustand/tablestore";

export default function Table () {
  const { tabs, currentTab } = useTabStore();

 const dataset = tabs[currentTab].dataset;
  if(!dataset) return null;

  const page = tabs[currentTab].page;
  const limit = tabs[currentTab].limit;
  const totalPages = tabs[currentTab].totalPages;

  const rowNumbers = [];
for (let i = 0; i < limit; i++) {
  rowNumbers.push(page * limit + i + 1);
}

const processedRows = dataset.rows.map((row, rowIndex) => {
  const lowerCaseRow = {};
  for (const key in row) {
    lowerCaseRow[key.toLowerCase()] = row[key];
  }
  return { ...lowerCaseRow, rowNumber: rowNumbers[rowIndex] };
});

const processedColumns = dataset.columns.map(column => ({
  ...column,
  name: column.name.toLowerCase()
}));

  const handleHeaderClick = (columnIndex) => {
    // Implement your header click logic here (e.g., sorting)
    console.log(`Header clicked at index: ${columnIndex}`);
  };

  return (
    <table className="bg-white">
      <thead>
        <tr>
          <th key="rowNumber">#</th>
          {processedColumns.map((column, index) => (
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
              {tabs[currentTab].useLabels ? column.label : column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {processedRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {/* Display the calculated row number from the row object */}
            <td key="rowNumber">{row.rowNumber}</td>
            {processedColumns.map((col, colIndex) => (
              <td key={colIndex}>{row[col.name] || "N/A"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};