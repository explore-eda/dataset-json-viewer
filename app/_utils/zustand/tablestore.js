import { create } from "zustand";

// Handles Data for current table
const useDataStore = create((set) => ({
  errorMessage: null,
  applicationStatus: ["Select a data source"],

  setErrorMessage: (error) =>
    set({
      errorMessage: error,
    }),

    setApplicationStatus: (status) => { // Use a colon here
      const time = new Date().toLocaleTimeString().split(" ")[0];
      const newStatus = [`[${time}]`, status].join(": ");
  
      set((state) => ({
        applicationStatus: [newStatus, ...state.applicationStatus],
      }));
    },  

  resetDataStore: () => set({errorMessage: null, applicationStatus: ["Cleared Application"]}),
}));

export { useDataStore };
