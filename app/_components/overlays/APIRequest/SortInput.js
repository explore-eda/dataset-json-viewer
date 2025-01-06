export default function SortInput({
  sortColumns,
  setSortColumns,
  datasetMetadata,
}) {
  const handleColumnClick = (column) => {
    const columnIndex = sortColumns.findIndex((c) => c.column === column);

    if (columnIndex === -1) {
      // Add new sort column with "desc" order (but show "▲")
      setSortColumns([...sortColumns, { column, order: "desc" }]);
    } else {
      // Remove sort column
      const updatedSortColumns = [...sortColumns];
      updatedSortColumns.splice(columnIndex, 1);
      setSortColumns(updatedSortColumns);
    }
  };

  return (
    <div>
      {datasetMetadata?.metadata.columns?.map((column) => (
        <div
          key={"sortinput" + column.name}
          className="flex items-center cursor-pointer"
          onClick={() => handleColumnClick(column.name)}
        >
          <label
            htmlFor={`sortinput-${column.name}`}
            className="mr-2 flex items-center"
          >
            {column.name}
            {sortColumns.some((c) => c.column === column.name) ? (
              <span className="ml-1">▼</span> // Show "▼" when sorted
            ) : (
              <span className="ml-1">▲</span> // Show "▲" by default
            )}
          </label>
        </div>
      ))}
    </div>
  );
}