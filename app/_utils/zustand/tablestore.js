import { create } from "zustand";

// Handles Data for current table
const useDataStore = create((set) => ({
  apiURL: "", // data source
  fileName: "",
  errorMessage: null,
  applicationStatus: "Initializing....",

  setApiURL: (url) =>
    set({
      apiURL: url,
    }),

  setErrorMessage: (error) =>
    set({
      errorMessage: error,
    }),

  setFileName: (file) =>
    set({
      fileName: file,
    }),

  setApplicationStatus: (status) =>
    set({
      applicationStatus: status,
    }),

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
          useLabels: false,
          datasetOID: tabName,
          datasetExtension: extension,

          dataset: dataset,
          totalRows: dataset.pagination.total,
          offset: dataset.pagination.offset,
          rowsPerPage: dataset.pagination.limit,
          totalOffset: (Math.ceil(dataset.pagination.total / dataset.pagination.limit)),
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

  setOffset: (tabName, number) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          ...state.tabs[tabName],
          offset: number,
        },
      },
    })),

  updatePageNumbers: (tabName, newRowsPerPage) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          ...state.tabs[tabName],
          rowsPerPage: newRowsPerPage,
          totalOffset: Math.ceil(state.tabs[tabName].totalRows / newRowsPerPage),
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
