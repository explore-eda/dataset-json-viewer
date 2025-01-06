export default function SelectInput({
    selectedColumns,
    setSelectedColumns,
    datasetMetadata,
  }) {
    const handleColumnSelect = (columnLabel) => {
      const columnIndex = selectedColumns.findIndex((col) => col === columnLabel);
  
      if (columnIndex === -1) {
        // Add selected column
        setSelectedColumns([...selectedColumns, columnLabel]);
      } else {
        // Remove deselected column
        const updatedSelectedColumns = [...selectedColumns];
        updatedSelectedColumns.splice(columnIndex, 1);
        setSelectedColumns(updatedSelectedColumns);
      }
    };
  
    return (
      <div>
          {datasetMetadata?.metadata.columns?.map((column) => (
                  <div key={"select"+column.name} className="flex items-center">
                    <label
                      htmlFor={`select-${column.label}`}
                      className="mr-2 cursor-pointer"
                    >
                      {column.name}
                    </label>
                    <input
                      type="checkbox"
                      id={`column-${column.name}`}
                      checked={selectedColumns.includes(column.name)}
                      onChange={() => handleColumnSelect(column.name)}
                      className="rounded border-gray-300"
                    />
                  </div>
                ))}
        </div>
    );
  }
  