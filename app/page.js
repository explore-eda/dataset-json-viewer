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
import useFetchTable from "./_utils/useFetchTable";
import useOpenFileDataset from "./_utils/useOpenFileDataset";
import FilteringOverlay from "./_components/table/filteringOverlay";


export default function Home() {
  const { handleClear } = useHandleClear();
  const { fetchTable } = useFetchTable();
  const { openFileDataset } = useOpenFileDataset();

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
  const [showFilteringOverlay, setShowFilteringOverlay] = useState(false);


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

  const callApi = (url, selectedStudy) => {
    fetchTable(url, selectedStudy);
  };

  // Handle File Open
  const handleFileOpen = (file) => {
    openFileDataset(file);
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
        setShowFilteringOverlay={() => setShowFilteringOverlay(true)}
      />
      <WorkSpace />
      <Footer/>

      {showApiURLInputOverlay && (
        <Overlay
          callApi={callApi}
          setShowInputOverlay={setShowAPIURLInputOverlay}
        />
      )}
      {showFilteringOverlay && (
        <FilteringOverlay
          setShowInputOverlay={setShowFilteringOverlay}
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
