"use client";

import Header from "./_layouts/header";
import WorkSpace from "./_layouts/workspace";
import Footer from "./_layouts/footer";
import Overlay from "./_components/overlay";
import { useState, useEffect } from "react";
import "./globals.css";
import { ToastContainer, toast, Bounce } from "react-toastify";

export default function Home() {
  const [applicationStatus, setApplicationStatus] = useState("Ready....");
  const [addressBarText, setAddressBarText] = useState("");

  // API Input
  const [apiURL, setApiURL] = useState("");
  const [showApiURLInputOverlay, setShowAPIURLInputOverlay] = useState(false);

  // Data File Input
  const [dataFile, setDataFile] = useState(null);
  const [json, setJson] = useState(null);

  const errorToast = (message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
  }

  // On Mount Load API Address from session storage
  useEffect(() => {
    const storedApiAddress = sessionStorage.getItem("apiUrl");
    if (storedApiAddress) {
      setApiURL(storedApiAddress);
      callApi(storedApiAddress);
    }
  }, []);

  const callApi = (url) => {
    if (url === "") return;
    setApplicationStatus("Fetching new API....");

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          errorToast(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setApplicationStatus("API Request Successful");
        console.log("API Request Successful:", data);
        clearDataFile();
        setJson(data);
        setApiURL(url);
        setAddressBarText(url);
        sessionStorage.setItem("apiUrl", url);
      })
      .catch((error) => {
        setApplicationStatus("Ready.. ");
        errorToast(error.message);
        });
  };

  // Handle File Open
  const handleFileOpen = (file) => {
    setApplicationStatus("File Opening....");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        clearApiURL();
        setDataFile(file);
        setAddressBarText(file.name);
        setJson(jsonData);
        setApplicationStatus("Opened File");
      } catch (error) {
        setApplicationStatus("Ready.. ");
        errorToast(error.message);
      }
    };

    reader.onerror = (error) => {
      setApplicationStatus("Ready.. ");
      errorToast(error.message);
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!json) {
      setApplicationStatus("No data to download");
      return;
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(json)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    if (!dataFile) {
      const urlParts = apiURL.split("/");
      link.download = urlParts[urlParts.length - 1];
    } else {
      link.download = dataFile.name;
    }

    link.click();
  };

  const handleClear = () => {
    clearApiURL();
    clearDataFile();
    setJson(null);
    setAddressBarText("");
    setApplicationStatus("Ready");
  };

  const clearApiURL = () => {
    setApiURL("");
    sessionStorage.setItem("apiUrl", "");
  };

  const clearDataFile = () => {
    setDataFile(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        handleFileOpen={handleFileOpen}
        handleOpenAPIOverlay={() => setShowAPIURLInputOverlay(true)}
        handleDownload={handleDownload}
        clearFunction={handleClear}
        addressBarText={addressBarText}
      />
      <WorkSpace json={json} />
      <Footer statusText={applicationStatus} />

      {showApiURLInputOverlay && (
        <Overlay
          callApi={callApi}
          setShowInputOverlay={setShowAPIURLInputOverlay}
        />
      )}
      <ToastContainer
        stacked
        position="bottom-center"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
