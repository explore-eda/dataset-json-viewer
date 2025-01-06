import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import SortInput from "./APIRequest/SortInput";
import SelectInput from "./APIRequest/SelectInput";
import QueryBuilder from "./APIRequest/QueryBuilder";
import "animate.css";
import { Select } from "@headlessui/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";
import useGetExtension from "@/app/_utils/useGetExtension";

export default function Overlay({
  handleFetchTable,
  setShowInputOverlay,
  errorToast,
  copyToast,
}) {
  const [url, setUrl] = useState("https://api.edacro.com");
  const [selectedStudy, setSelectedStudy] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [newApiAddress, setNewApiAddress] = useState("");

  const [studies, setStudies] = useState([]);
  const [dataset, setDataset] = useState(null);
  const [validDataset, setValidDataset] = useState(true);
  const [datasetMetadata, setDatasetMetadata] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { getExtension } = useGetExtension();

  const handleRowsPerPageChange = (e) => {
    if (e.target.value <= 0 || isNaN(e.target.value)) {
      return;
    }
    setRowsPerPage(e.target.value);
  };

  const handleOverlayClose = () => {
    setShowInputOverlay(false);
  };

  const handleUrlChange = (url) => {
    setUrl(url);
    setStudies([]);
    setSelectedStudy("");
    setNewApiAddress("");
    setDataset(null);
    setSelectedDataset("");
    setDatasetMetadata(null);
    clear();
  };

  const handleNewUrl = (url) => {
    setUrl(url);

    const fetchFiles = async () => {
      try {
        console.log("Fetching files from:", url);
        const response = await fetch(url + "/studies");
        const data = await response.json();

        const studyOptions = data.map((study) => ({
          name: study.studyOID,
          description: study.description,
        }));
        setStudies(studyOptions);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  };

  const handleFileChange = (e) => {
    const selectedStudy = e.target.value;
    if (selectedStudy) {
      setSelectedStudy(selectedStudy);
      setNewApiAddress(url + "/studies/" + selectedStudy + "/datasets");
      fetchDataset(selectedStudy);
      setDataset(null);
      setSelectedDataset("");
      setDatasetMetadata(null);
      clear();
    } else {
      setSelectedStudy("");
      setNewApiAddress("");
      setDataset(null);
      setSelectedDataset("");
      setDatasetMetadata(null);
      clear();
    }
  };

  const fetchDataset = async (selectedStudy) => {
    try {
      console.log(
        "Fetching datasets from:",
        url + "/studies/" + selectedStudy + "/datasets"
      );
      const response = await fetch(
        url + "/studies/" + selectedStudy + "/datasets"
      );
      const data = await response.json();

      const datasetOptions = data.map((dataset) => ({
        name: dataset.datasetOID,
      }));
      setDataset(datasetOptions);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    }
  };

  const handleDatasetChange = (e) => {
    const selectedDataset = e.target.value;

    setDatasetMetadata(null);
    clear();
    const fileExtension = getExtension(selectedDataset);
    if (fileExtension !== "ndjson" && fileExtension !== "json") {
      if (fileExtension === "") {
        setValidDataset(true);
      } else {
        errorToast("Invalid file type. Please select a JSON or NDJSON File.");
        setValidDataset(false);
      }
      setNewApiAddress(url + "/studies/" + selectedStudy + "/datasets");
      setSelectedDataset("");
      return;
    }

    setValidDataset(true);
    setSelectedDataset(selectedDataset);
    setNewApiAddress(
      url + "/studies/" + selectedStudy + "/datasets/" + selectedDataset
    );
    fetchDataSetMetaData(selectedDataset);
  };

  const fetchDataSetMetaData = async (selectedDataset) => {
    try {
      console.log(
        "Fetching metadata from:",
        url +
          "/studies/" +
          selectedStudy +
          "/datasets/" +
          selectedDataset +
          "?metadataonly=true"
      );
      const response = await fetch(
        url +
          "/studies/" +
          selectedStudy +
          "/datasets/" +
          selectedDataset +
          "?metadataonly=true"
      );
      const data = await response.json();

      console.log("metadata", data);

      setDatasetMetadata(data);
      setSelectedColumns2(data.metadata.columns.map((column) => column.name));
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const [selectedColumns2, setSelectedColumns2] = useState([]);
  const [sortColumns, setSortColumns] = useState([]);
  const [pages, setPages] = useState(0);

  const [queryString, setQueryString] = useState("");

  console.log(datasetMetadata);

  const handleOverlaySave = () => {
    let filters = {};
    if (datasetMetadata) {
      const rowConfig = {
        queryString,
        selectedColumns,
        selectedOperators,
        inputValues,
        types,
        selectedANDOR,
        hasErrors,
      };

      filters = {
        filterQuery: queryString,
        selectedColumns: datasetMetadata.metadata.columns.filter((column) =>
          selectedColumns2.includes(column.name)
        ),
        sortColumns: getSortColumnString(),
        rowsPerPage: rowsPerPage,
        rowConfig: rowConfig,
      };
    }

    handleFetchTable(url, selectedStudy, selectedDataset, filters);
    setShowInputOverlay(false);
  };

  const [selectedColumns, setSelectedColumns] = useState([""]); // Array to store selected columns
  const [selectedOperators, setSelectedOperators] = useState(["=="]); // Array to store selected operators
  const [selectedANDOR, setSelectedANDOR] = useState([""]); // Array to store selected operators
  const [inputValues, setInputValues] = useState([""]); // Array to store input values
  const [types, setTypes] = useState([]); // Array to store data types
  const [hasErrors, setHasErrors] = useState([]); // Array to store boolean flags indicating errors

  const handleCopyClick = () => {
    if (newApiAddress) {
      navigator.clipboard.writeText(newApiAddress);
      copyToast("Copied to clipboard");
    }
  };

  useEffect(() => {
    if (datasetMetadata) {
      let newApiAddress = `${url}/studies/${selectedStudy}/datasets/${selectedDataset}?`;

      if (queryString) {
        newApiAddress += `filter=${queryString}&`;
      }
      if (sortColumns.length > 0) {
        const sortcols = getSortColumnString()
          .map((s) => s)
          .join(",");
        newApiAddress += `sort=${sortcols}&`;
      }
      //const offset = page*limit;
      newApiAddress += `offset=${0}&limit=${rowsPerPage}`;

      setNewApiAddress(newApiAddress);
    }
  }, [queryString, selectedColumns2, sortColumns, rowsPerPage]);

  const getSortColumnString = () => {
    return sortColumns.map((c) => `${c.column} ${c.order}`);
  };

  const clear = () => {
    setDatasetMetadata(null);
    setRowsPerPage(10);
    setSelectedColumns2();
    setSortColumns([]);
    setQueryString("");

    setSelectedColumns([""]);
    setSelectedOperators(["=="]);
    setSelectedANDOR([""]);
    setInputValues([""]);
    setHasErrors([""]);
    setTypes([""]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="fixed inset-0 flex items-center justify-center mt-10 mb-10 animate__animated animate__fadeInDown">
        <div className="bg-white p-16 md:mt-0 rounded-md relative overflow-y-auto max-h-full">
          <div className="flex flex-col md:flex-row gap-5">
            <div
              className={`${
                datasetMetadata
                  ? "z-50 md:border-r-2 md:pr-4 bg-white"
                  : "max-w-44"
              }`}
            >
              <button
                className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 rounded-full p-1 hover:bg-slate-200"
                onClick={handleOverlayClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold mb-4">API URL Generator</h2>
              <div className="mb-4 w-full">
                <label
                  htmlFor="apiAddress"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Sponsor Domain:
                </label>
                <div className="w-72 md:w-96 flex flex-row">
                  <input
                    type="text"
                    id="urlAddress"
                    className="shadow appearance-none border rounded md:w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onBlur={(e) => handleNewUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNewUrl(e.target.value);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleNewUrl(url)}
                    className="bg-custom-blue hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div>
                <div
                  className={`mb-4 w-72 md:w-96 ${
                    studies.length > 0 ? "block" : "hidden"
                  }`}
                >
                  <label
                    htmlFor="fileSelect"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Select Study:
                  </label>
                  <select
                    id="fileSelect"
                    className="shadow appearance-none border rounded w-72 md:w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleFileChange}
                  >
                    <option value="">Select a Study</option>
                    {studies.map((study) => (
                      <option key={study.name} value={study.name}>
                        {study.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`mb-4 w-72 md:w-96 ${
                    studies.length > 0 && dataset?.length > 0
                      ? "block"
                      : "hidden"
                  }`}
                >
                  <label
                    htmlFor="fileSelect"
                    className={`block text-gray-700 font-bold mb-2`}
                  >
                    Select Dataset:
                  </label>
                  <select
                    id="fileSelect"
                    className={`shadow appearance-none rounded w-72 md:w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      !validDataset ? "border border-red-500" : ""
                    }`}
                    onChange={handleDatasetChange}
                  >
                    <option value="">Select a Dataset</option>
                    {dataset?.map((dataset) => (
                      <option key={dataset.name}>{dataset.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={` ${datasetMetadata ? "mt-4 block " : "hidden"}`}>
                <label
                  htmlFor="apiAddress"
                  className="block text-gray-700 font-bold"
                >
                  Row Query:
                </label>
                <div className="w-96" style={{ wordWrap: "break-word" }}>
                  <QueryBuilder
                    queryString={queryString}
                    setQueryString={setQueryString}
                    datasetMetadata={datasetMetadata}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                    selectedOperators={selectedOperators}
                    setSelectedOperators={setSelectedOperators}
                    selectedANDOR={selectedANDOR}
                    setSelectedANDOR={setSelectedANDOR}
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                    types={types}
                    setTypes={setTypes}
                    hasErrors={hasErrors}
                    setHasErrors={setHasErrors}
                  />
                </div>
              </div>
            </div>

            <div
              className={` ${
                datasetMetadata
                  ? "z-20 block animate__animated animate__slideInLeft"
                  : "hidden"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl max-md:hidden md:block  font-bold">
                  Dataset Configuration
                </h2>
              </div>
              <div className="mb-4">
                <div className="w-72">{datasetMetadata?.metadata.label}</div>
                <div className="w-72">
                  Number of Records: {datasetMetadata?.metadata.records}
                </div>
                <div className="w-72">
                  Number of Columns: {datasetMetadata?.metadata.columns?.length}
                </div>
              </div>
              <div>
                <div>
                  <label
                    htmlFor="rowsPerPage"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Rows Per Page:
                  </label>
                  <div className="mb-4 flex items-center gap-4">
                    <input
                      type="number"
                      id="rowsPerPage"
                      className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                    />
                    <div className="py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      {`Number of Pages:   
                  ${Math.ceil(
                    datasetMetadata?.metadata.records / rowsPerPage
                  )}`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-gray-700 font-bold mb-2">
                Select Visible Columns
              </div>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
                <SelectInput
                  selectedColumns={selectedColumns2}
                  setSelectedColumns={setSelectedColumns2}
                  datasetMetadata={datasetMetadata}
                />
              </div>
              <div>
                <div className="text-gray-700 font-bold my-2">
                  Select Sort Columns
                </div>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
                  <SortInput
                    sortColumns={sortColumns}
                    setSortColumns={setSortColumns}
                    datasetMetadata={datasetMetadata}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between content-center items-center max-w- md:max-w-2xl mt-2 md:mt-0 gap-4 ">
            <div className="flex flex-col justify-between">
              <label
                htmlFor="apiAddress"
                className="block text-gray-700 font-bold"
              >
                Generated API Request:
              </label>
              <div className="flex flex-row items-center border border-gray-300 rounded p-2">
                <div className="max-w-76 md:w-full" style={{ wordWrap: "break-word" }}>
                  {newApiAddress}
                </div>
                <button className="flex items-center" onClick={handleCopyClick}>
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button
              className={`bg-custom-blue hover:bg-blue-900 text-white font-bold py-2 px-4 mt-4 md:mt-2 rounded focus:outline-none focus:shadow-outline mr-2 ${
                !selectedStudy ? "opacity-25 cursor-not-allowed" : ""
              }`}
              onClick={() => handleOverlaySave(newApiAddress)}
              disabled={!selectedStudy}
            >
              <span className="whitespace-nowrap">
                {selectedDataset ? "Request Dataset" : "Request Study Library"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
