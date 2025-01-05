import { useEffect } from "react";

export default function Table({ tab }) {
  if (!tab) {
    return null;
  }

  const dataset = tab.dataset;
  if (!dataset) return null;

  const rowNumbers = [];
  for (let i = 0; i < tab.limit; i++) {
    rowNumbers.push(tab.page * tab.limit + i + 1);
  }

  let processedRows; 
  if (tab.sourceType === "local") {
    processedRows = dataset.rows
      .slice(tab.page * tab.limit, (tab.page + 1) * tab.limit)
      .map((row, rowIndex) => {
        const lowerCaseRow = {};
        for (const key in row) {
          lowerCaseRow[key.toLowerCase()] = row[key];
        }
        return { ...lowerCaseRow, rowNumber: rowNumbers[rowIndex] };
      });
  } else {
    processedRows = dataset.rows.map((row, rowIndex) => {
      const lowerCaseRow = {};
      for (const key in row) {
        lowerCaseRow[key.toLowerCase()] = row[key];
      }
      return { ...lowerCaseRow, rowNumber: rowNumbers[rowIndex] };
    });
  }

  const processedColumns = tab.visibleColumns.map((column) => ({
    ...column,
    name: column.name.toLowerCase(),
  }));


  const handleHeaderClick = (columnIndex) => {
    // Implement your header click logic here (e.g., sorting)
    console.log(`Header clicked at index: ${columnIndex}`);
  };

  return (
    <table className="bg-white mb-20">
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
              {tab.useLabels ? column.label : column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {processedRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td key="rowNumber">{row.rowNumber}</td>
            {processedColumns.map((col, colIndex) => (
              <td key={colIndex}>{row[colIndex] || "N/A"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
