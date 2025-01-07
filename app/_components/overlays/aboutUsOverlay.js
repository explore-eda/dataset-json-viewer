import React, { use, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function AboutUsOverlay({
  tab,
  setShowOverlay,
  errorToast,
  handleUpdate,
}) {
  const [data, setData] = useState("");
  useEffect(() => {
    fetch("https://api.edacro.com/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch about Us");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  console.log(data);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="fixed inset-0 flex items-center justify-center mt-10 mb-10 animate__animated animate__fadeInDown">      
      <div className="bg-white p-16 md:mt-0 max-w-md md:max-w-4xl rounded-md relative overflow-y-auto max-h-full">

        <button
          className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 rounded-full p-1 hover:bg-slate-200"
          onClick={handleOverlayClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-col max-w-xl md:max-w-2xl gap-1">
            <h1 className="font-bold text-2xl mt-2">Welcome to the EDA Dataset-JSON Viewer!</h1>
          <h1 className="font-bold text-xl mt-2">Viewer Info</h1>
          <p>EDA Dataset-JSON Viewer | Version: 1.0.0</p>
          <p>
            Description: A tool for browsing, filtering, and analyzing datasets
            stored on Azure Blob Storage, adhering to the Dataset-JSON v1.1
            specification. Designed for simplicity and scalability.
          </p>
          <h1 className="font-bold text-xl mt-2">Support</h1>
          <p> EDA Clinical Research Organization</p>
          <p> Email: support@edaclinical.com</p>{" "}
          <p>
            Issues URL: https://github.com/edacro/dataset-json-viewer/issues
          </p>
          <p> Open Source License: AGPL-3.0</p>
          <h1 className="font-bold text-xl mt-2">Specification</h1>
          <p>
            Standard: Dataset-JSON v1.1 </p>
            <p>Details: This tool supports JSON files that comply with the Dataset-JSON v1.1 specification, a standard for Clinical Datasets. </p>
            <p>Reference Repository: https://github.com/cdisc-org/DataExchange-DatasetJson
            Contents:</p>
            <p>Schema, Specification, Examples API: EDA Dataset-JSON Viewer API:
          Version: 2.0.0 Documentation: https://api.edacro.com/docs Status:
          api_status has context menu
          </p>
        </div>
      </div>
    </div>
    </div>

  );
}
