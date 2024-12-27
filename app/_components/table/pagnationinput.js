import React from 'react'; 

export default function Pagination({setCurrentPage, pageNumbers, setRowsPerPage, rowsPerPage, dataset}) {

    const totalPages = Math.ceil(dataset.rows.length / rowsPerPage);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    return (
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
        </div>
    )
}