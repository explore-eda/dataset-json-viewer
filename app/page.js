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
import useOpenFileDataset from "./_utils/useOpenFileDataset";
import TabList from "./_components/table/tablist";

export default function Home() {
  const { openFileDataset } = useOpenFileDataset();

  const [tabs, setTabs] = useState({});
  const [currentTab, setCurrentTab] = useState("");

  const addTab = (tabName, dataset, dataSource, dataType, sourceType) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        tabID: tabName,
        dataSource: dataSource,
        displayApi: dataSource,
        datasetOID: tabName,
        dataset: dataset,
        type: dataType,
        sourceType: sourceType,


        sortFilters: [],
        useLabels: false,
        visibleColumns: dataset?.columns ?? [],
        rowConfig: [],
        rowQuery: "",

        paginationActive: true,
        page: 0,
        total: dataset.pagination?.total ?? dataset.rows?.length ?? 0,
        limit: dataset.pagination?.limit ?? dataset.rows?.limit ?? 10,
        totalPages: dataset.pagination
          ? Math.ceil(dataset.pagination.total / dataset.pagination.limit)
          : 0,
      },
    }));
  };

  const updateVisibleColumns = (tabName, newColumns) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        visibleColumns: newColumns,
      },
    }));
  }

  const updateUseLabels = (tabName, useLabels) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        useLabels: useLabels,
      },
    }));
  }

  const updateDisplayApi = (tabName, api) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        displayApi: api,
      },
    }));
  }

  const updateRowQuery = (tabName, query, config) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        rowQuery: query,
        rowConfig: config,
      },
    }));
  };

  const removeTab = (tabName) => {
    setTabs((prevTabs) => {
      const newTabs = { ...prevTabs };
      delete newTabs[tabName];

      let newCurrentTab = currentTab;
      if (currentTab === tabName) {
        const tabKeys = Object.keys(newTabs);
        newCurrentTab = tabKeys[tabKeys.length - 1] || null;
        setCurrentTab(newCurrentTab);
      }

      return newTabs;
    });
  };

  const setDataset = (tabName, dataset) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        dataset: dataset,
      },
    }));
  };

  const setPage = (tabName, page) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        page: page,
      },
    }));

    if (tabs[tabName].page > tabs[tabName].totalPages - 1) {
      setPage(tabs[tabName]?.tabID, tabs[tabName]?.totalPages - 1);
    }
  };

  const updateSortFilters = (tabName, sortFilters) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        sortFilters: sortFilters,
      },
    }));
  }

  const updateLimit = (tabName, newLimit) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        limit: newLimit,
        totalPages: Math.ceil(tabs[tabName].total / newLimit),
      },
    }));
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
          addTab(selectedData, data, request, "dataset", "api");
          setCurrentTab(selectedData);

          setApplicationStatus(`[${selectedData}] Successfully fetched table `);
          return true;
        } else {
          addTab(selectedStudy, data, request, "library", "api");
          setCurrentTab(selectedStudy);

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

  const handleDatasetFromLibrary = (event, datasetOID) => {
    if (event.shiftKey) {
      event.preventDefault();
      fetchDatasetFromLibrary(datasetOID);
    } else {
      const value = fetchDatasetFromLibrary(datasetOID);

      if (value) {
        setCurrentTab(datasetOID);
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
          addTab(datasetOID, data, request, "dataset", "api");
          setApplicationStatus(
            `[${datasetOID}]: Successfully fetched dataset `
          );
          return true;
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
  };

  const [showPagingOverlay, setShowPagingOverlay] = useState(false);
  const [showColumnOverlay, setShowColumnOverlay] = useState(false);
  const [showRowOverlay, setShowRowOverlay] = useState(false);
  const [showSortOverlay, setShowSortOverlay] = useState(false);


  const handlePagingUpdate = (newLimit) => {
    updateLimit(tabs[currentTab].tabID, newLimit);
  }

  const handleColumnUpdate = (newColumns, useLabels) => {
    updateVisibleColumns(tabs[currentTab].tabID, newColumns);
    updateUseLabels(tabs[currentTab].tabID, useLabels);
  }

  const handleSortUpdate = (sortFilters) => {
    updateSortFilters(tabs[currentTab].tabID, sortFilters);
  }

  const handleRowUpdate = (query, config) => {
    updateRowQuery(tabs[currentTab].tabID, query, config);
  }

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
        <PagingOverlay setShowOverlay={setShowPagingOverlay} tab={tabs[currentTab]} errorToast={errorToast} handleUpdate={handlePagingUpdate} />
      )}
      {showColumnOverlay && (
        <ColumnOverlay setShowOverlay={setShowColumnOverlay} tab={tabs[currentTab]} errorToast={errorToast} handleUpdate={handleColumnUpdate}/>
      )}
      {showRowOverlay && <RowOverlay setShowOverlay={setShowRowOverlay} tab={tabs[currentTab]} errorToast={errorToast} handleUpdate={handleRowUpdate}/>}
      {showSortOverlay && <SortOverlay setShowOverlay={setShowSortOverlay} tab={tabs[currentTab]} errorToast={errorToast} handleUpdate={handleSortUpdate}/>}
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
