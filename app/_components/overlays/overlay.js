import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Overlay({ fetchTable, setShowInputOverlay }) {
  const [url, setUrl] = useState("");
  const [selectedStudy, setSelectedStudy] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [newApiAddress, setNewApiAddress] = useState("");

  const [studies, setStudies] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [datasetMetadata, setDatasetMetadata] = useState(null);

  const [pages, setPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOverlaySave = () => {
    fetchTable(url, selectedStudy, selectedDataset);
    setShowInputOverlay(false);
  };

  const handleOverlayClose = () => {
    setShowInputOverlay(false);
  };

  const handleUrlChange = (url) => {
    setUrl(url);
    setStudies([]);
    setSelectedStudy("");
    setNewApiAddress("");
    setDataset([]);
    setSelectedDataset("");
    setDatasetMetadata(null);
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
    if(selectedStudy) {
      setSelectedStudy(selectedStudy);
      setNewApiAddress(url + "/studies/" + selectedStudy + "/datasets");
      fetchDataset(selectedStudy);
      setDataset([]);
      setSelectedDataset("");
      setDatasetMetadata(null);
    } else {
      setSelectedStudy("");
      setNewApiAddress("");
      setDataset([]);
      setSelectedDataset("");
      setDatasetMetadata(null);
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
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-16 rounded-md relative">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="">
            <button
              className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 rounded-full p-1 hover:bg-slate-200"
              onClick={handleOverlayClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Data Source</h2>
            <div className="mb-4 w-full">
              <label
                htmlFor="apiAddress"
                className="block text-gray-700 font-bold mb-2"
              >
                Url:
              </label>
              <input
                type="text"
                id="urlAddress"
                className="shadow appearance-none border rounded w-72 md:w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onBlur={(e) => handleNewUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNewUrl(e.target.value);
                  }
                }}
              />
            </div>

            <div>
              <div className="mb-4 w-72 md:w-96">
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

              <div className="mb-4 w-72 md:w-96">
                <label
                  htmlFor="fileSelect"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Select Dataset:
                </label>
                <select
                  id="fileSelect"
                  className="shadow appearance-none border rounded w-72 md:w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleDatasetChange}
                >
                  <option value="">Select a Dataset</option>
                  {dataset.map((dataset) => (
                    <option key={dataset.name}>{dataset.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={` ${datasetMetadata ? "block" : "hidden"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Dataset Configuration</h2>
            </div>
            <div className="w-72">Records: {datasetMetadata?.records}</div>
            <div>Pagination:</div>
            <div>Limit: {datasetMetadata?.limit}</div>
            <div>Offset: {datasetMetadata?.offset}</div>
            <div>select visibile columns</div>
            <div>filter here</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <label
              htmlFor="apiAddress"
              className="block text-gray-700 font-bold"
            >
              Generated API Request:
            </label>
            <div className="w-96" style={{ wordWrap: "break-word" }}>
              {newApiAddress}
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={() => handleOverlaySave(newApiAddress)}
          >
            Request
          </button>
        </div>
      </div>
    </div>
  );
}
