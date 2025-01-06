import { useDataStore } from "./zustand/tablestore";

// Separate API request handling
const useParseNDJSON = () => {
  const { 
    setApplicationStatus,
    setErrorMessage,
  } = useDataStore();

  const parseNDJSON = (data) => {
      const output = {
        datasetJSONCreationDateTime: null,
        datasetJSONVersion: null,
        fileOID: null,
        dbLastModifiedDateTime: null,
        originator: null,
        sourceSystem: null,
        studyOID: null,
        metaDataVersionOID: null,
        metaDataRef: null,
        itemGroupOID: null,
        records: null,
        name: null,
        label: null,
        columns: null,
        rows: [],
        pagination: null,
      };
  
      const lines = data.trim().split("\n");
  
      if (lines.length === 0) {
        return output; // Handle empty data
      }
  
      const firstLine = JSON.parse(lines[0]);
      output.datasetJSONCreationDateTime = firstLine.datasetJSONCreationDateTime;
      output.datasetJSONVersion = firstLine.datasetJSONVersion;
      output.fileOID = firstLine.fileOID;
      output.dbLastModifiedDateTime = firstLine.dbLastModifiedDateTime;
      output.originator = firstLine.originator;
      output.sourceSystem = firstLine.sourceSystem;
      output.studyOID = firstLine.studyOID;
      output.metaDataVersionOID = firstLine.metaDataVersionOID;
      output.metaDataRef = firstLine.metaDataRef;
      output.itemGroupOID = firstLine.itemGroupOID;
      output.records = firstLine.records;
      output.name = firstLine.name;
      output.label = firstLine.label;
      output.columns = firstLine.columns;
  
      for (let i = 1; i < lines.length - 1; i++) {
        const lineData = JSON.parse(lines[i]);
        output.rows.push(Object.values(lineData)); // Extract values as an array
      }
  
      const lastLine = JSON.parse(lines[lines.length - 1]);
      output.pagination = lastLine.pagination;
  
      return output;
  };

  return {
    parseNDJSON,
  };
};

export default useParseNDJSON;