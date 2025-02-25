import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function PagingOverlay({
  tab,
  setShowOverlay,
  errorToast,
  handleUpdate,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [limit, setLimit] = useState(tab?.limit || 10);

  const handleChange = (e) => {
    if(isNaN(e.target.value) || e.target.value <= 0) {
      return;
    }
    setLimit(e.target.value);
  }

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  const handleOverlaySave = () => {
    if (isNaN(limit) || limit <= 0) {
      errorToast("Please enter a positive number for rows per page.");
      setErrorMessage("Please enter a positive number for rows per page.");
      return;
    }
    handleUpdate(limit);
    setShowOverlay(false);
  };

  useEffect(() => {
    if (!tab || tab?.type === "library") {
      errorToast("Please Select a Valid Table");
      setShowOverlay(false);
    }
  }, []);
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-16 rounded-md relative">
      <button
        className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 rounded-full p-1 hover:bg-slate-200"
        onClick={handleOverlayClose}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-4">Pagination Configuration</h2>

        <div className="mb-4">
          <label
            htmlFor="apiAddress"
            className="block text-gray-700 font-bold mb-2"
          >
            Rows Per Page (limit):
          </label>
          <input
            type="number"
            id="limitInput"
            className={`shadow appearance-none border rounded w-full md:w-72 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 ${
              errorMessage ? "border-red-500" : ""
            }`}
            value={limit}
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewUrl(e.target.value);
              }
            }}
          />
        </div>

        <div className="flex justify-between items-center gap-4">
          <div>
          <div>Total: Records: {tab?.total}</div>
          <div>Total Pages: {Math.ceil(tab?.total / limit)}</div>
          </div>
          <button
            className="self-end bg-custom-blue hover:bg-blue-900 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={() => handleOverlaySave()}
          >
            Update Pagination
          </button>
        </div>
      </div>
    </div>
  </div>
);
}