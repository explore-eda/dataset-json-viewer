import React, { useState, useEffect } from "react";
import "./workspace.css";
import { useRef } from "react";
import PaginationInput from "../_components/table/pagnationinput";
import useTableStore from '../_utils/tablestore';


const WorkSpace = ({ json }) => {
  const { 
    dataset, 
    setDataset, 
    rowsPerPage, 
    setRowsPerPage, 
    currentPage, 
    setCurrentPage, 
    updatePageNumbers 
  } = useTableStore(); 

  const tableRef = useRef(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [useLabels, setUseLabels] = useState(false);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.classList.add("slide-up");
    }
  }, [dataset]);

  useEffect(() => {
    if (json) {
      setDataset(json);
      setVisibleColumns(json.columns);
      updatePageNumbers();
    } else {
        setDataset({ columns: [], rows: [] });
        setVisibleColumns([]);
        updatePageNumbers();
    }
  }, [json, setDataset, updatePageNumbers]);

  useEffect(() => {
    updatePageNumbers();
  }, [rowsPerPage, updatePageNumbers]); 

  const handleHeaderClick = (columnIndex) => {
    console.log(`Clicked column index: ${columnIndex}`);
  };

  return (
    <main className="background h-full w-full shadow-inner relative overflow-hidden">
      <div className="px-2 overflow-auto h-full">
        {dataset.rows.length > 0 ? (
          <div>
            <PaginationInput 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              dataset={dataset} 
              rowsPerPage={rowsPerPage} 
              setRowsPerPage={setRowsPerPage} 
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
      </div>
    </main>
  );
};

export default WorkSpace;
