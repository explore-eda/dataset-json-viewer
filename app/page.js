"use client";

import Header from "./_layouts/header";
import WorkSpace from "./_layouts/workspace";
import Footer from "./_layouts/footer";
import Overlay from "./_components/overlay";
import { useState, useEffect } from "react";
import "./globals.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {useDataStore} from "./_utils/zustand/tablestore";
import useHandleClear from "./_utils/useHandleClear";
import useFetchLibraryTable from "./_utils/useFetchLibraryTable";

export default function Home() {
  const { handleClear } = useHandleClear();
  const { fetchLibraryTable } = useFetchLibraryTable(); 

  const { 
    errorMessage,
  } = useDataStore();

  useEffect(() => {
    if(errorMessage){
      errorToast(errorMessage);
    }
  }, [errorMessage]);

  // API Input
  const [showApiURLInputOverlay, setShowAPIURLInputOverlay] = useState(false);

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

  const callApi = (url) => {
    fetchLibraryTable(url);
  };

  // Handle File Open
  const handleFileOpen = (file) => {
    /*
    setApplicationStatus("File Opening....");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        handleClear();
        const jsonData = JSON.parse(e.target.result);
        setAddressBarText(file.name);

        handleJSONType(jsonData);

        setApplicationStatus("Opened File");
      } catch (error) {
        setApplicationStatus("Initializing.. ");
        errorToast(error.message);
      }
    };

    reader.onerror = (error) => {
      setApplicationStatus("Initializing.. ");
      errorToast(error.message);
    };

    reader.readAsText(file);
        */
  };

  const handleDownload = () => {
    /*
    if (!dataset) {
      setApplicationStatus("No data to download");
      return;
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(tab[currentTab].dataset)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    if (apiURL) {
      const urlParts = apiURL.split("/");
      link.download = urlParts[urlParts.length - 1];
    } else {
      link.download = addressBarText;
    }
          link.click();
    */

  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        handleFileOpen={handleFileOpen}
        handleOpenAPIOverlay={() => setShowAPIURLInputOverlay(true)}
        handleDownload={handleDownload}
        clearFunction={handleClear}
      />
      <WorkSpace />
      <Footer/>

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
