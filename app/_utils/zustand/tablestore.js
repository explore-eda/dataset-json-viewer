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

export { useDataStore };
