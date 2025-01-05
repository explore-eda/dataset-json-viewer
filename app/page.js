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

export default function Home() {
  const [tabs, setTabs] = useState({});
  const [currentTab, setCurrentTab] = useState("");

  const addTab = (
    tabName,
    dataset,
    dataSource,
    dataType,
    sourceType,
    extension,
    defaultLimit
  ) => {
    console.log(
      "addTab",
      tabName,
      dataset,
      dataSource,
      dataType,
      sourceType,
      extension,
      defaultLimit
    );
    const tabUUID = Date.now();
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabUUID]: {
        tabUUID: tabUUID,
        tabID: tabName,
        dataSource: dataSource,
        displayApi: dataSource,
        datasetOID: tabName,
        dataset: dataset,
        type: dataType,
        sourceType: sourceType,
        extension: extension,

        sortFilters: [],
        useLabels: false,
        visibleColumns: dataset?.columns ?? [],
        rowConfig: [],
        rowQuery: "",

        paginationActive: true,
        page: 0,
        total: dataset.pagination?.total ?? dataset.rows?.length ?? 0,
        limit: defaultLimit ?? 10,
        totalPages: Math.ceil(
          (dataset.pagination?.total ?? dataset.rows?.length ?? 0) /
            (defaultLimit ?? 10)
        ),
      },
    }));
    return tabUUID;
  };

  const updateVisibleColumns = (tabName, newColumns) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        visibleColumns: newColumns,
      },
    }));
  };

  const updateUseLabels = (tabName, useLabels) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        useLabels: useLabels,
      },
    }));
  };

  const updateDisplayApi = (tabName, api) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        displayApi: api,
      },
    }));
  };

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
        console.log("newCurrentTab", newCurrentTab);
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
    console.log("setPage", tabName, page);
    const posTotalPages = Math.max(tabs[tabName]?.totalPages - 1, 0);
    const newPage = Math.min(page, posTotalPages);
    console.log("newPage", newPage);
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        page: newPage,
      },
    }));
  };

  const updateSortFilters = (tabName, sortFilters) => {
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        sortFilters: sortFilters,
      },
    }));
  };

  const updateTotal = (tabName, newTotal) => {
    const newTotalPages = Math.ceil(newTotal / tabs[tabName].limit);
    console.log("updateTotal", tabName, newTotal, newTotalPages);
    const posTotalPages = Math.max(newTotalPages - 1, 0);
    const newPage = Math.min(tabs[tabName].page, posTotalPages);
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        total: newTotal,
        totalPages: newTotalPages,
        page: newPage,
      },
    }));
  };

  const updateLimit = (tabName, newLimit) => {
    const newTotalPages = Math.ceil(tabs[tabName].total / newLimit);
    setTabs((prevTabs) => ({
      ...prevTabs,
      [tabName]: {
        ...prevTabs[tabName],
        limit: newLimit,
        totalPages: newTotalPages,
        page: Math.min(tabs[tabName].page, newTotalPages - 1),
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
      errorToast("No internet connection. Please connect and try again.");
      return false;
    }

    const request =
      url + "/studies/" + selectedStudy + "/datasets" + "/" + selectedData;
    setApplicationStatus(
      `[${selectedData ?? selectedStudy}] Fetching New Table`
    );

    return fetch(request)
      .then((response) => {
        if (!response.ok) {
          setApplicationStatus(
            `[${selectedData ?? selectedStudy}] Failed to fetch new table `
          );
          errorToast(response.status);
          return false;
        }
        const extension = getExtension(request);
        if (extension === "ndjson") {
          console.log("response", response);
          return response.text().then(parseNDJSON);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (selectedData) {
          const tabUUID = addTab(
            selectedData,
            data,
            request,
            "dataset",
            "api",
            getExtension(selectedData)
          );
          setCurrentTab(tabUUID);

          setApplicationStatus(
            `[${selectedData}] Successfully fetched Dataset Table `
          );
          return true;
        } else {
          const tabUUID = addTab(
            selectedStudy,
            data,
            request,
            "library",
            "api",
            getExtension(selectedStudy)
          );
          setCurrentTab(tabUUID);

          setApplicationStatus(
            `[${selectedStudy}] Successfully fetched Library Table `
          );
          return true;
        }
      })
      .catch((error) => {
        setApplicationStatus("Failed to fetch table: " + request);
        errorToast(error.message);
        console.log("response", error.message);

        return false;
      });
  };

  function parseNDJSON(data) {
    const output = {
      datasetJSONCreationDateTime: null,
      datasetJSONVersion: null,
      fileOID: null,
      dbLastModifiedDateTime: null,
      originator: null,
      sourceSystem: null,
      studyOID: null,
      metaDataVersionOID: null,
      metaDataRef: null,
      itemGroupOID: null,
      records: null,
      name: null,
      label: null,
      columns: null,
      rows: [],
      pagination: null,
    };

    const lines = data.trim().split("\n");

    if (lines.length === 0) {
      return output; // Handle empty data
    }

    const firstLine = JSON.parse(lines[0]);
    output.datasetJSONCreationDateTime = firstLine.datasetJSONCreationDateTime;
    output.datasetJSONVersion = firstLine.datasetJSONVersion;
    output.fileOID = firstLine.fileOID;
    output.dbLastModifiedDateTime = firstLine.dbLastModifiedDateTime;
    output.originator = firstLine.originator;
    output.sourceSystem = firstLine.sourceSystem;
    output.studyOID = firstLine.studyOID;
    output.metaDataVersionOID = firstLine.metaDataVersionOID;
    output.metaDataRef = firstLine.metaDataRef;
    output.itemGroupOID = firstLine.itemGroupOID;
    output.records = firstLine.records;
    output.name = firstLine.name;
    output.label = firstLine.label;
    output.columns = firstLine.columns;

    for (let i = 1; i < lines.length - 1; i++) {
      const lineData = JSON.parse(lines[i]);
      output.rows.push(Object.values(lineData)); // Extract values as an array
    }

    const lastLine = JSON.parse(lines[lines.length - 1]);
    output.pagination = lastLine.pagination;

    return output;
  }

  const getExtension = (filename) => {
    return filename.split(".").pop();
  };

  // Handle File Open
  const handleFileOpen = (file) => {
    setApplicationStatus("File Opening....");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const extention = getExtension(file.name);
        let jsonData;
        if(extention === "ndjson") {
          jsonData = parseNDJSON(e.target.result);
        }else {
          jsonData = JSON.parse(e.target.result);
        }
        const tabUUID = addTab(
          file.name,
          jsonData,
          file.name,
          "dataset",
          "local",
          getExtension(file.name)
        );
        setCurrentTab(tabUUID);
        setApplicationStatus("Opened File");
      } catch (error) {
        errorToast(error.message);
      }
    };

    reader.onerror = (error) => {
      setApplicationStatus("Error Opening File");
      errorToast(error.message);
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!currentTab) {
      errorToast("No data to download");
      return;
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(tabs[currentTab].dataset)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    if (tabs[currentTab].sourceType === "api") {
      const urlParts = tabs[currentTab].dataSource.split("/");
      link.download = urlParts[urlParts.length - 1];
    } else {
      link.download = tabs[currentTab].dataSource;
    }
    link.click();
  };

  const handleDatasetFromLibrary = (event, datasetOID) => {
    if (event.shiftKey) {
      event.preventDefault();
      fetchDatasetFromLibrary(datasetOID);
    } else {
      fetchDatasetFromLibrary(datasetOID)
        .then((value) => {
          if(value) {
          console.log("value", value);
          setCurrentTab(value);}
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  const fetchDatasetFromLibrary = (datasetOID) => {
    if (tabs.hasOwnProperty(datasetOID)) {
      return true;
    } else {
      if (!navigator.onLine) {
        errorToast("No internet connection. Please connect and try again.");
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
          const extension = getExtension(request);
          if (extension === "ndjson") {
            console.log("response", response);
            return response.text().then(parseNDJSON);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (data === false) {
            return false;
          }
          // This block only executes if response.ok was true
          const tabUUID = addTab(
            datasetOID,
            data,
            request,
            "dataset",
            "api",
            getExtension(datasetOID)
          );
          setApplicationStatus(
            `[${datasetOID}]: Successfully fetched dataset `
          );
          return tabUUID;
        })
        .catch((error) => {
          errorToast(`[${datasetOID}]: ` + error.message);
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
    updateLimit(currentTab, newLimit);
  };

  const handleColumnUpdate = (newColumns, useLabels) => {
    updateVisibleColumns(currentTab, newColumns);
    updateUseLabels(currentTab, useLabels);
  };

  const handleSortUpdate = (sortFilters) => {
    updateSortFilters(currentTab, sortFilters);
  };

  const handleRowUpdate = (query, config) => {
    updateRowQuery(currentTab, query, config);
  };

  const handleSetPage = (page) => {
    console.log("handleSetPage", currentTab, page);
    setPage(currentTab, page);
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
      <div className="background h-full overflow-hidden">
        <TabList
          tabs={tabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          removeTab={removeTab}
          overlayFunction={() => setShowAPIURLInputOverlay(true)}
        />

        <WorkSpace
          tab={tabs[currentTab]}
          handleDatasetFromLibrary={handleDatasetFromLibrary}
          setDataset={setDataset}
          updateDisplayApi={updateDisplayApi}
          updateTotal={updateTotal}
          parseNDJSON={parseNDJSON}
          getExtension={getExtension}
        />
      </div>

      <Footer tab={tabs[currentTab]} setPage={handleSetPage} />
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
