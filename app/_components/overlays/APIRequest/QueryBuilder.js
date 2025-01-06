import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import "../overlay.css";

export default function QueryBuilder({
    queryString,
    setQueryString,
    datasetMetadata,
    selectedColumns,
    setSelectedColumns,
    selectedOperators,
    setSelectedOperators,
    selectedANDOR,
    setSelectedANDOR,
    inputValues,
    setInputValues,
    types,
    setTypes,
    hasErrors,
    setHasErrors,
}) {
  const columns = datasetMetadata?.metadata.columns;

  const handleANDORChange = (event, index) => {
    const newSelectedANDOR = [...selectedANDOR];
    newSelectedANDOR[index + 1] = event.target.value;
    setSelectedANDOR(newSelectedANDOR);
  };

  useEffect(() => {
    console.log(hasErrors);
    // Construct the query string
    let queryString = "";

    const newHasErrors = inputValues.map((value) => value === "");

    if (!newHasErrors.some((error) => error)) {
      for (let i = 0; i < selectedColumns.length; i++) {
        queryString += `${selectedColumns[i]}${selectedOperators[i]}`;
        if (types[i] === "date") {
          const formattedDate = new Date(inputValues[i])
            .toISOString()
            .slice(0, 10);
          queryString += `"${formattedDate}"`;
        } else if (types[i] === "string") {
          queryString += `"${inputValues[i]}"`;
        } else {
          queryString += `${inputValues[i]}`;
        }
        if (selectedANDOR[i + 1]) {
          queryString += ` ${selectedANDOR[i + 1]} `;
        }
      }
    }

    setQueryString(queryString);
  }, [selectedColumns, selectedOperators, inputValues, types, selectedANDOR]);

  const handleOverlaySave = () => {
    const newHasErrors = inputValues.map((value) => value === "");
    setHasErrors(newHasErrors);

    if (newHasErrors.some((error) => error)) {
      errorToast("Please fill in all fields.");
      return;
    }

    const rowConfig = {
      queryString,
      selectedColumns,
      selectedOperators,
      inputValues,
      types,
      selectedANDOR,
      hasErrors,
    };

    handleUpdate(queryString, rowConfig);
    setShowOverlay(false);
  };

  const handleColumnChange = (event, index) => {
    console.log("event.target.value", event.target.value);
    const newSelectedColumns = [...selectedColumns];
    newSelectedColumns[index] = event.target.value;
    console.log("newSelectedColumns", newSelectedColumns);
    setSelectedColumns(newSelectedColumns);

    console.log("event.target.value", event.target.value);
    console.log("selectedColumns", selectedColumns);

    const selectedColumnObject = columns.find(
      (column) => column.name === event.target.value
    );
    console.log("selectedColumnObject", selectedColumnObject);

    const newTypes = [...types];
    newTypes[index] = selectedColumnObject?.dataType;
    console.log("newTypes", newTypes);
    setTypes(newTypes);

    const newInputValues = [...inputValues];
    newInputValues[index] = "";
    setInputValues(newInputValues);
  };

  const handleOperatorChange = (event, index) => {
    const newSelectedOperators = [...selectedOperators];
    newSelectedOperators[index] = event.target.value;
    setSelectedOperators(newSelectedOperators);
  };

  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);

    const newHasErrors = [...hasErrors];
    newHasErrors[index] = newInputValues[index] === "";
    setHasErrors(newHasErrors);
  };

  const handleAddFilterSection = () => {
    setSelectedColumns([...selectedColumns, ""]);
    setSelectedOperators([...selectedOperators, "=="]);
    setInputValues([...inputValues, ""]);
    setTypes([...types, ""]);
    setSelectedANDOR([...selectedANDOR, "and"]);
    setHasErrors([...hasErrors, false]);
  };

  const getInputComponent = (index) => {
    switch (types[index]) {
      case "string":
        return (
          <input
            type="text"
            value={inputValues[index]}
            onChange={(event) => handleInputChange(event, index)}
            className={`input-field w-full ${hasErrors[index] ? "error" : ""}`}
          />
        );
      case "integer":
        return (
          <input
            type="number"
            value={inputValues[index]}
            onChange={(event) => handleInputChange(event, index)}
            className={`input-field w-full ${hasErrors[index] ? "error" : ""}`}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={inputValues[index]}
            onChange={(event) => handleInputChange(event, index)}
            className={`input-field w-full ${hasErrors[index] ? "error" : ""}`}
          />
        );
      default:
        if (types[index] && selectedOperators[index]) {
          return (
            <input
              value={inputValues[index]}
              onChange={(event) => handleInputChange(event, index)}
              className={`input-field w-full ${hasErrors[index] ? "error" : ""}`}
            />
          );
        }
        return (
          <input
            disabled
            value={inputValues[index]}
            className={`input-field w-full ${hasErrors[index] ? "error" : ""}`}
          />
        );
    }
  };

  const handleRemoveFilterSection = (index) => {
    const newSelectedColumns = [...selectedColumns];
    newSelectedColumns.splice(index, 1);
    setSelectedColumns(newSelectedColumns);

    const newSelectedOperators = [...selectedOperators];
    newSelectedOperators.splice(index, 1);
    setSelectedOperators(newSelectedOperators);

    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1);
    setInputValues(newInputValues);

    const newTypes = [...types];
    newTypes.splice(index, 1);
    setTypes(newTypes);

    const newSelectedANDOR = [...selectedANDOR];
    newSelectedANDOR.splice(index, 1);
    setSelectedANDOR(newSelectedANDOR);

    const newHasErrors = [...hasErrors];
    newHasErrors.splice(index, 1);
    setHasErrors(newHasErrors);
  };
    return (
        <div className="flex flex-col gap-2 justify-center">

              {selectedColumns.map((column, index) => (
                <div key={index}>
                  <div className="flex flex-row sm:justify-between items-center">
                    <div className="flex flex-col gap-2 w-full ">
                      <select
                        value={selectedColumns[index]}
                        onChange={(event) => handleColumnChange(event, index)}
                        className={`input-field ${
                          hasErrors[index] ? "error" : ""
                        }`}
                      >
                        <option value="">Select Column</option>
                        {columns?.map((column) => (
                          <option key={column.name} value={column.name}>
                            {column.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedOperators[index]}
                        onChange={(event) => handleOperatorChange(event, index)}
                        className={`input-field ${
                          hasErrors[index] ? "error" : ""
                        }`}
                      >
                        <option value="==">{"Equals (==)"}</option>
                        <option value="!=">{"Not Equals (!=)"}</option>
                        <option value=">">{"Greater Than (>)"}</option>
                        <option value="<">{"Less Than (<)"}</option>
                        <option value=">=">
                          {"Greater Than or Equal To (>=)"}
                        </option>
                        <option value="<=">
                          {"Less Than or Equal To (<=)"}
                        </option>
                      </select>

                      <div className="w-full">{getInputComponent(index)}</div>

                      {index < selectedColumns.length - 1 && (
                        <select
                          value={selectedANDOR[index + 1]}
                          onChange={(event) => handleANDORChange(event, index)}
                          className={`input-field ${
                            hasErrors[index] ? "error" : ""
                          }`}
                        >
                          <option value="and">and</option>
                          <option value="or">or</option>
                        </select>
                      )}
                    </div>
                    <button
                      className="ml-1 px-2 py-1 text-xs text-black rounded-full hover:bg-gray-100"
                      onClick={() => handleRemoveFilterSection(index)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex flex-row gap-8 ">
                <textarea
                  type="text"
                  className="input-field grow h-full resize-none"
                  placeholder="Query Generated"
                  value={queryString}
                  onChange={(event) => setQueryString(event.target.value)}
                />

                <div className="justify-end">
                  <button
                    onClick={handleAddFilterSection}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                  >
                    + Add Filter
                  </button>

                </div>
              </div>
            </div>
    );
}