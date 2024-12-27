import { create } from 'zustand';

const useTableStore = create((set) => ({
  currentPage: 1, 
  rowsPerPage: 10, 
  dataset: { columns: [], rows: [] },
  pageNumbers: [],

  setDataset: (data) => set({ 
    dataset: data,  
  }),

  setRowsPerPage: (rows) => set({ 
    rowsPerPage: rows,
  }),

  setCurrentPage: (page) => set({ 
    currentPage: page 
  }),

  updatePageNumbers: () => 
    set((state) => {
      const newPageNumbers = [];
      for (let i = 1; i <= Math.ceil(state.dataset.rows.length / state.rowsPerPage); i++) {
        newPageNumbers.push(i);
      }
      return { pageNumbers: newPageNumbers };
    }),
}));

export default useTableStore;