export default function Table ({tab}) {

 const dataset = tab.dataset;
  if(!dataset) return null;

  const page = tab.page;
  const limit = tab.limit;
  const totalPages = tab.totalPages;

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
              <td key={colIndex}>{row[col.name] || "N/A"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};