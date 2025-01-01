import { create } from "zustand";

// Handles Data for current table
const useDataStore = create((set) => ({
  fileName: "",
  errorMessage: null,
  applicationStatus: ["Loaded Application"], // Changed to an array

  setErrorMessage: (error) =>
    set({
      errorMessage: error,
    }),

  setFileName: (file) =>
    set({
      fileName: file,
    }),

  setApplicationStatus: (status) =>
    set((state) => ({
      applicationStatus: [status, ...state.applicationStatus], // Use spread syntax to append
  })),

  resetDataStore: () => set({ apiURL: "", errorMessage: null, fileName: "" }),
}));

// Handles Data for Tabs
const useTabStore = create((set) => ({
  tabs: {},
  currentTab: null,
  tablistActive: false,

  setCurrentTab: (tabName) => set({ currentTab: tabName }),

  setTabListActive: (value) =>
    set({
      tablistActive: value,
    }),

  addTab: (tabName, dataset, extension) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          datasetOID: tabName,
          dataset: dataset,
          datasetExtension: extension,

          useLabels: false,

          filteringActive: false,
          sortingActive: false,

          paginationActive: true,
          total: dataset.pagination.total,
          limit: dataset.pagination.limit,
          page: 0,
          totalPages: (Math.ceil(dataset.pagination.total / dataset.pagination.limit)),
        },
      },
  })),

  setDataset: (tabName, dataset) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          ...state.tabs[tabName],
          dataset: dataset,
        },
      },
  })),

  setPage: (tabName, number) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          ...state.tabs[tabName],
          page: number,
        },
      },
    })),

  updateLimit: (tabName, newLimit) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          ...state.tabs[tabName],
          limit: newLimit,
          totalPages: Math.ceil(state.tabs[tabName].total / newLimit),
        },
      },
    })),

  resetTabStore: () => set({ tabs: {}, currentTab: null }),
}));

// Handles Data for Library Table
const useLibraryTableStore = create((set) => ({
  // Library Table
  libraryTable: [],
  libraryTableActive: false,
  libraryURL: "", // data source

  setLibraryURL: (url) =>
    set({
      libraryURL: url,
  }),

  setLibraryTableActive: (value) =>
    set({
      libraryTableActive: value,
    }),

  setLibraryTable: (json) =>
    set({
      libraryTable: json,
    }),

  resetLibraryTableStore: () =>
    set({ libraryTable: [], libraryTableActive: false }),
}));

export { useDataStore, useTabStore, useLibraryTableStore };
