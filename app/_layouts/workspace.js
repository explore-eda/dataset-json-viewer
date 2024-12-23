import React, { useState, useEffect } from "react";
import "./workspace.css";
import { useRef } from "react";

const WorkSpace = ({ json }) => {
  const [dataset, setDataset] = useState({ columns: [], rows: [] });
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [useLabels, setUseLabels] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.classList.add("slide-up");
    }
  }, [dataset]);

  useEffect(() => {
    if (json) {
      setDataset(json);
      setVisibleColumns(json.columns);
    } else {
        setDataset({ columns: [], rows: [] });
        setVisibleColumns([]);
    }
  }, [json]);

  const handleHeaderClick = (columnIndex) => {
    // Implement sorting logic here if needed
    console.log(`Clicked column index: ${columnIndex}`);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Implement search logic here (e.g., filter rows)
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Pagination Logic
  const totalPages = Math.ceil(dataset.rows.length / rowsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <main className="background h-full w-full shadow-inner relative overflow-hidden">
      <div className="px-2 overflow-auto h-full">
        <div>
          <span className="search-icon" onClick={handleSearchToggle} />
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          )}
        </div>

        {dataset.rows.length > 0 ? (
          <div>
            <label htmlFor="rowsPerPageInput">Rows per page:</label>
            <input
              type="number"
              id="rowsPerPageInput"
              value={rowsPerPage}
              min="1"
              onChange={handleRowsPerPageChange}
              className="w-16 ml-2 border-2 border-gray-400 rounded-md"
            />

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
          </div>
        ) : (
          <div className="text-center text-lg text-black/40"></div>
        )}
        <div>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default WorkSpace;
