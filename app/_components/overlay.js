import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Overlay({ callApi, setShowInputOverlay }) {
    const handleOverlaySave = (newApiAddress) => {
        callApi(newApiAddress);
        setShowInputOverlay(false);
      };
    
      const handleOverlayClose = () => {
        setShowInputOverlay(false);
      };

  const [newApiAddress, setNewApiAddress] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-20 rounded-md relative">
        <button
          className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 rounded-full p-1 hover:bg-slate-200"
          onClick={handleOverlayClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">API Configuration</h2>
        <div className="mb-4 w-full">
          <label
            htmlFor="apiAddress"
            className="block text-gray-700 font-bold mb-2"
          >
            API Address:
          </label>
          <input
            type="text"
            id="apiAddress"
            className="shadow appearance-none border rounded w-72 md:w-92 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newApiAddress}
            onChange={(e) => setNewApiAddress(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={() => handleOverlaySave(newApiAddress)}
          >
            Request
          </button>
        </div>
      </div>
    </div>
  );
}
