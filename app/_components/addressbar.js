import React, { useState, useRef } from "react";

export default function AddressBar({handleOpenAPIOverlay, handleFileOpen, addressBarText }) {
  const [selectedOption, setSelectedOption] = useState("");
  const fileInputRef = useRef(null);


  const handleButtonClick = () => {
    console.log("FileUploadMenuItem: Button clicked");
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    console.log("FileUploadMenuItem: File changed 2", event.target.files[0]);
    const file = event.target.files[0];
    handleFileOpen(file);
    event.target.value = ''; 
  };

  const handleOptionChange = (event) => {
    if(event.target.value === "1") {
      handleOpenAPIOverlay();
      setSelectedOption("");
      return
    } else if (event.target.value === "2") {
      handleButtonClick();
      setSelectedOption("");
      return
    }
    setSelectedOption(event.target.value);
    handleAddressChange(event.target.value);
  };

  return (
    <div className="flex flex-row items-center justify-center mb-4  w-full ">
      <span className="ml-10 text-lg">Address:</span>
      <select
        className="border-2 border-gray-500 rounded-sm shadow-inner w-full mx-5 bg-gray-100"
        value={selectedOption}
        onChange={handleOptionChange}
      >

      <option value="" disabled >{addressBarText}</option>
      <hr className="my-1 border-gray-400 mb-2" />
      <option value="1">Make API Request</option>
      <option value="2">Open Local File</option>

      </select>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}