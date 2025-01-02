import { create } from "zustand";

// Handles Data for current table
const useDataStore = create((set) => ({
  errorMessage: null,
  applicationStatus: ["Loaded Application"],

  setErrorMessage: (error) =>
    set({
      errorMessage: error,
    }),

  setApplicationStatus: (status) =>
    set((state) => ({
      applicationStatus: [status, ...state.applicationStatus],
  })),

  resetDataStore: () => set({errorMessage: null, applicationStatus: ["Cleared Application"]}),
}));

// Handles Data for Tabs
const useTabStore = create((set) => ({
  tabs: {},
  currentTab: null,

  setCurrentTab: (tabName) => set({ currentTab: tabName }),

  addTab: (tabName, dataset, dataSource, dataType, sourceType) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          dataSource: dataSource,
          datasetOID: tabName,
          dataset: dataset,
          type: dataType,
          sourceType: sourceType,

          useLabels: false,

          filteringActive: false,
          sortModel: [],
          

          paginationActive: true,
          page: 0,
          total: dataset.pagination?.total ?? dataset.rows?.length ?? 0,
          limit: dataset.pagination?.limit ?? dataset.rows?.limit ?? 10,
          totalPages: dataset.pagination ? Math.ceil(dataset.pagination.total / dataset.pagination.limit) : 0,
        },
      },
  })),

  setSortModel: (tabName, sortModel) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: {
          ...state.tabs[tabName],
          sortModel: sortModel,
        },
      },
  })),

  removeTab: (tabName) =>
    set((state) => {
      const newTabs = { ...state.tabs };
      delete newTabs[tabName];

      let newCurrentTab = state.currentTab;
      if (state.currentTab === tabName) {
        newCurrentTab = null;
      }

      return { 
        ...state,
        tabs: newTabs, 
        currentTab: newCurrentTab 
      };
    }),

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

  resetTabStore: () => set({ tabs: {}, currentTab: null}),
}));

export { useDataStore, useTabStore };
