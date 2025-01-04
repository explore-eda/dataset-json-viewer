"use client";

import { useRef } from "react";
import Header from "./_layouts/header";
import WorkSpace from "./_layouts/workspace";
import Footer from "./_layouts/footer";
import Overlay from "./_components/overlays/overlay";
import PagingOverlay from "./_components/overlays/pagingOverlay";
import ColumnOverlay from "./_components/overlays/columnOverlay";
import RowOverlay from "./_components/overlays/rowOverlay";
import SortOverlay from "./_components/overlays/sortOverlay";
import { useState, useEffect } from "react";
import "./globals.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useDataStore } from "./_utils/zustand/tablestore";
import TabList from "./_components/table/tablist";
import Tab from './_utils/tab';


export default function Home() {

  const [tabs, setTabs] = useState({});
  const [currentTab, setCurrentTab] = useState("");

  const addTab = (datasetName, dataset, dataSource, dataType, sourceType, newLimit) => {
    const newTab = new Tab(datasetName, dataset, dataSource, dataType, sourceType, newLimit); 
    setTabs((prevTabs) => ({
      ...prevTabs,
      [newTab.tabUUID]: newTab, 
    }));

    return newTab.tabUUID;
  };

  const removeTab = (tabUUID) => {
    setTabs((prevTabs) => {
      const newTabs = { ...prevTabs };
      delete newTabs[tabUUID];

      let newCurrentTab = currentTab;
      if (currentTab === tabUUID) {
        const tabKeys = Object.keys(newTabs);
        newCurrentTab = tabKeys[tabKeys.length - 1] || null;
        console.log("newCurrentTab", newCurrentTab);
        setCurrentTab(newCurrentTab);
      }

      return newTabs;
    });
  };

  const setDataset = (dataset) => {
    tabs[currentTab].setDataset(dataset);
  };

  const updateVisibleColumns = (newColumns) => {
    console.log("currtab", tabs[currentTab])
    tabs[currentTab].setVisibleColumns(newColumns);
  }

  const updateUseLabels = (useLabels) => {
    tabs[currentTab].updateUseLabels(useLabels);
  }

  const updateDisplayApi = (api) => {
    tabs[currentTab].updateDisplayApi(api);
  }

  const updateRowQuery = (query, config) => {
    tabs[currentTab].updateRowQuery(query, config);
  }

  const setPage = (page) => {
    tabs[currentTab].setPage(page);
  };

  const updateSortFilters = (sortFilters) => {
    tabs[currentTab].setSortFilters(sortFilters);
  };

  const updateLimit = (newLimit) => {
    tabs[currentTab].setLimit(newLimit);
  };

  const { errorMessage, setApplicationStatus } = useDataStore();

  useEffect(() => {
    if (errorMessage) {
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
  };

  const fetchTable = (url, selectedStudy, selectedData) => {
    if (url === "" || selectedStudy == "") return;
    if (!navigator.onLine) {
      setErrorMessage("No internet connection. Please connect and try again.");
      return false;
    }

    const request =
      url + "/studies/" + selectedStudy + "/datasets" + "/" + selectedData;
    setApplicationStatus(`[${selectedStudy}] Fetching New Table "`);
    return fetch(request)
      .then((response) => {
        if (!response.ok) {
          setApplicationStatus(`[${selectedStudy}] Failed to fetch new table `);
          setErrorMessage(response.status);
          return false;
        }
        return response.json();
      })
      .then((data) => {
        if (selectedData) {
          const tabUUID = addTab(selectedData, data, request, "dataset", "api");
          setCurrentTab(tabUUID);

          setApplicationStatus(`[${selectedData}] Successfully fetched table `);
          return true;
        } else {
          const tabUUID = addTab(selectedStudy, data, request, "library", "api");
          setCurrentTab(tabUUID);

          setApplicationStatus(
            `[${selectedStudy}] Successfully fetched table `
          );
          return true;
        }
      })
      .catch((error) => {
        setApplicationStatus("Failed to fetch table: " + request);
        setErrorMessage(error.message);
        return false;
      });
  };

  // Handle File Open
  const handleFileOpen = (file) => {
    setApplicationStatus("File Opening....");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const tabUUID = addTab(file.name, jsonData, "C:" + file.name, "dataset", "local");
        setCurrentTab(tabUUID);

        setApplicationStatus("Opened File");
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    reader.onerror = (error) => {
      setApplicationStatus("Error Opening File");
      setErrorMessage(error.message);
    };

    reader.readAsText(file);
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

  const handleDatasetFromLibrary = (event, datasetOID) => {
    if (event.shiftKey) {
      event.preventDefault();
      fetchDatasetFromLibrary(datasetOID);
    } else {
      const value = fetchDatasetFromLibrary(datasetOID);

      if (value) {
        setCurrentTab(value);
      }
    }
  };

  const fetchDatasetFromLibrary = (datasetOID) => {
    if (tabs.hasOwnProperty(datasetOID)) {
      return true;
    } else {
      if (!navigator.onLine) {
        setErrorMessage(
          "No internet connection. Please connect and try again."
        );
        return false;
      }

      // Make the API request
      const request = tabs[currentTab].dataSource + `/${datasetOID}`;
      setApplicationStatus(`[${datasetOID}]: Fetching New Dataset`);
      return fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data === false) {
            return false;
          }
          // This block only executes if response.ok was true
          const tabUUID = addTab(datasetOID, data, request, "dataset", "api");
          setApplicationStatus(
            `[${datasetOID}]: Successfully fetched dataset `
          );
          return tabUUID;
        })
        .catch((error) => {
          setErrorMessage(`[${datasetOID}]: ` + error.message);
          setApplicationStatus(`[${datasetOID}]: ` + error.message);
          return false;
        });
    }
  };

  const handleClear = () => {
    setTabs({});
    setCurrentTab(null);
    setApplicationStatus("Cleared Workspace");
  };

  const [showPagingOverlay, setShowPagingOverlay] = useState(false);
  const [showColumnOverlay, setShowColumnOverlay] = useState(false);
  const [showRowOverlay, setShowRowOverlay] = useState(false);
  const [showSortOverlay, setShowSortOverlay] = useState(false);

  const handlePagingUpdate = (newLimit) => {
    updateLimit(newLimit);
  };

  const handleColumnUpdate = (newColumns, useLabels) => {
    updateVisibleColumns(newColumns);
    updateUseLabels(useLabels);
  };

  const handleSortUpdate = (sortFilters) => {
    updateSortFilters(sortFilters);
  };

  const handleRowUpdate = (query, config) => {
    updateRowQuery(query, config);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        handleFileOpen={handleFileOpen}
        handleOpenAPIOverlay={() => setShowAPIURLInputOverlay(true)}
        handleDownload={handleDownload}
        clearFunction={handleClear}
        pagingFunction={() => setShowPagingOverlay(true)}
        columnFunction={() => setShowColumnOverlay(true)}
        rowFunction={() => setShowRowOverlay(true)}
        sortFunction={() => setShowSortOverlay(true)}
        addressBarText={tabs[currentTab]?.displayApi}
      />
      <div className="background h-full w-full overflow-hidden">
        <TabList
          tabs={tabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          removeTab={removeTab}
        />
        <WorkSpace
          tab={tabs[currentTab]}
          handleDatasetFromLibrary={handleDatasetFromLibrary}
          setDataset={setDataset}
          updateDisplayApi={updateDisplayApi}
        />
      </div>
      <Footer tab={tabs[currentTab]} setPage={setPage} />

      {showApiURLInputOverlay && (
        <Overlay
          fetchTable={fetchTable}
          setShowInputOverlay={setShowAPIURLInputOverlay}
        />
      )}
      {showPagingOverlay && (
        <PagingOverlay
          setShowOverlay={setShowPagingOverlay}
          tab={tabs[currentTab]}
          errorToast={errorToast}
          handleUpdate={handlePagingUpdate}
        />
      )}
      {showColumnOverlay && (
        <ColumnOverlay
          setShowOverlay={setShowColumnOverlay}
          tab={tabs[currentTab]}
          errorToast={errorToast}
          handleUpdate={handleColumnUpdate}
        />
      )}
      {showRowOverlay && (
        <RowOverlay
          setShowOverlay={setShowRowOverlay}
          tab={tabs[currentTab]}
          errorToast={errorToast}
          handleUpdate={handleRowUpdate}
        />
      )}
      {showSortOverlay && (
        <SortOverlay
          setShowOverlay={setShowSortOverlay}
          tab={tabs[currentTab]}
          errorToast={errorToast}
          handleUpdate={handleSortUpdate}
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
