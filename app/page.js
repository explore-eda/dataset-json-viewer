"use client";

import Header from "./_layouts/header";
import WorkSpace from "./_layouts/workspace";
import Footer from "./_layouts/footer";
import Overlay from "./_components/overlay";
import { useState, useEffect } from "react";
import "./globals.css";

export default function Home() {
  const [applicationStatus, setApplicationStatus] = useState("Ready....");
  const [addressBarText, setAddressBarText] = useState("");

  // API Input
  const [apiURL, setApiURL] = useState("");
  const [showApiURLInputOverlay, setShowAPIURLInputOverlay] = useState(false);

  // Data File Input
  const [dataFile, setDataFile] = useState(null);
  const [json, setJson] = useState(null);
  
  // On Mount Load API Address from session storage
  useEffect(() => {
    const storedApiAddress = sessionStorage.getItem('apiAddress');
    if (storedApiAddress) {
      setApiURL(storedApiAddress); 
    }
  }, []);

  // Handle File Open
  const handleOpen = (file) => {
    setDataFile(file);
    clearApiURL();
    setApplicationStatus("File Opening....");
    setAddressBarText(file.name);
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        setJson(jsonData);
        setApplicationStatus("Opened File");
        console.log("File content parsed:", jsonData); // Log after parsing
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setApplicationStatus("Error parsing JSON: " + error.message);
      }
    };
  
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setApplicationStatus("Error reading file.");
    };
  
    reader.readAsText(file);
  };

  // Handle API Request
  useEffect(() => {
    if (apiURL === "") return;
    setJson(null);
    setApplicationStatus("Fetching new API....");
    console.log("Making API Request", apiURL);
    setAddressBarText(apiURL);

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setJson(data);
        setApplicationStatus("API Request Successful");
        sessionStorage.setItem('apiAddress', apiURL);

        console.log("API Request Successful:", data);
      })
      .catch((error) => {
        setApplicationStatus("API Request Failed: " + error.message);
        console.error("API Request Failed:", error);
      }
    );
  }, [apiURL]);

  const handleUpload = () => {
    setShowAPIURLInputOverlay(true);
  };

  const handleDownload = () => {
    if (!json) {
      setApplicationStatus("No data to download");
      return;
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(json)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    if (!dataFile) {
      const urlParts = apiURL.split("/");
      link.download = urlParts[urlParts.length - 1]; 
    } else {
      link.download = dataFile.name;
    }
    
    link.click();
  };

  const clearApiURL = () => {
    setApiURL("");
    sessionStorage.setItem('apiAddress', "");
  }

  const clearDataFile = () => {
    setDataFile(null);
    setJson(null);
  }

  const handleClear = () => {
    setDataFile(null);
    setJson(null);
    setAddressBarText("");
    setApiURL("");
    setApplicationStatus("Ready");
    sessionStorage.clear();
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        openFunction={handleOpen}
        uploadFunction={handleUpload}
        handleDownload={handleDownload}
        clearFunction={handleClear}
        addressBarText={addressBarText}
        setShowInputOverlay={setShowAPIURLInputOverlay}
      />
      <WorkSpace json={json}/>
      <Footer statusText={applicationStatus}  />

      {showApiURLInputOverlay && (
        <Overlay
          setApiAddress={setApiURL}
          setShowInputOverlay={setShowAPIURLInputOverlay}
        />
      )}
    </div>
  );
}
