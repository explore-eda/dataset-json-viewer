import useTableStore from '../../_utils/tablestore'; // Import your store

export default function PaginationSelection() {
  const { pageNumbers, setCurrentPage } = useTableStore(); // Access state and actions

  return (
    <div>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => setCurrentPage(pageNumber)} // Use setCurrentPage action
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
}