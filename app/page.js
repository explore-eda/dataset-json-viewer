"use client";

import Header from "./_components/header";
import WorkSpace from "./_components/workspace";
import Footer from "./_components/footer";
import Overlay from "./_components/overlay";
import StatusBar from "./_components/statusbar";
import { useState, useEffect } from "react";
import "./globals.css";

export default function Home() {
  const [applicationStatus, setApplicationStatus] = useState("Ready....");
  const [apiAddress, setApiAddress] = useState("");
  const [dataFile, setDataFile] = useState(null);
  const [showInputOverlay, setShowInputOverlay] = useState(false);

  const handleOpen = (event) => {
    setDataFile(event.target.files[0]);
    console.log("Opening File", event.target.files[0]);
  };

  useEffect(() => {
    if (apiAddress === "") return;
    setApplicationStatus("Fetching new API....");
    console.log("Making API Request", apiAddress);
  }, [apiAddress]);

  const handleUpload = () => {
    setShowInputOverlay(true);
  };

  const handleClear = () => {
    setDataFile(null);
    setApiAddress("");
    setApplicationStatus("Ready");
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        openFunction={handleOpen}
        uploadFunction={handleUpload}
        clearFunction={handleClear}
        setApiAddress={setApiAddress}
        apiAddress={apiAddress}
      />
      <WorkSpace />
      <StatusBar statusText={applicationStatus} />
      <Footer />

      {showInputOverlay && (
        <Overlay
          setApiAddress={setApiAddress}
          setShowInputOverlay={setShowInputOverlay}
        />
      )}
    </div>
  );
}
