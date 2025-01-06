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
import useFetchTable from "./_utils/useFetchTable";
import useParseNDJSON from "./_utils/useParseNDJSON";
import useOpenFile from "./_utils/useOpenFile";
import useDownloadFile from "./_utils/useDownloadFile";
import useFetchTableFromLibrary from "./_utils/useFetchTableFromLibrary";


export default function Home() {
  const [tabs, setTabs] = useState({});
  const [currentTab, setCurrentTab] = useState("");

  const { fetchTable } = useFetchTable();
  const { openFile } = useOpenFile();
  const { parseNDJSON } = useParseNDJSON();
  const { downloadFile } = useDownloadFile();
  const { fetchTableFromLibrary } = useFetchTableFromLibrary();

  // Overlays
  const [showApiOverlay, setShowApiOverlay] = useState(false);
  const [showPagingOverlay, setShowPagingOverlay] = useState(false);
  const [showColumnOverlay, setShowColumnOverlay] = useState(false);
  const [showRowOverlay, setShowRowOverlay] = useState(false);
  const [showSortOverlay, setShowSortOverlay] = useState(false);

  // Error Handling
  const { errorMessage, setApplicationStatus } = useDataStore();

  useEffect(() => {
    if (errorMessage) {
      errorToast(errorMessage);
    }
  }, [errorMessage]);

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

  // Data Handling
  const addTab = (
    tabName,
    dataset,
    dataSource,
    dataType,
    sourceType,
    extension,
    initFilters
  ) => {
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

        sortFilters: initFilters?.sortColumns ?? [],
        useLabels: false,
        visibleColumns: initFilters?.selectedColumns ?? dataset?.columns ?? [],
        rowConfig: initFilters?.rowConfig ?? [],
        rowQuery: initFilters?.filterQuery ?? "",

        paginationActive: true,
        page: 0,
        total: dataset.pagination?.total ?? dataset.rows?.length ?? 0,
        limit: initFilters?.rowsPerPage ?? 10,
        totalPages: Math.ceil(
          (dataset.pagination?.total ?? dataset.rows?.length ?? 0) /
            (initFilters?.rowsPerPage ?? 10)
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
    const posTotalPages = Math.max(tabs[tabName]?.totalPages - 1, 0);
    const newPage = Math.min(page, posTotalPages);
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

  // Handle Functions
  const handleFetchTable = (url, selectedStudy, selectedData, initFilters) => {
    fetchTable(url, selectedStudy, selectedData, initFilters, addTab, setCurrentTab, setApplicationStatus, errorToast);
  };

  const handleFileOpen = (file) => {
    openFile(file, addTab, setCurrentTab, setApplicationStatus, errorToast);
  };

  const handleDownload = () => {
    downloadFile(tabs, currentTab, errorToast);
  };

  const handleTableFromLibrary = (event, datasetOID) => {
    if (event.shiftKey) {
      event.preventDefault();
      fetchTableFromLibrary(datasetOID, tabs, currentTab, addTab, setCurrentTab, setApplicationStatus, errorToast);
    } else {
      fetchTableFromLibrary(datasetOID, tabs, currentTab, addTab, setCurrentTab, setApplicationStatus, errorToast)
        .then((value) => {
          if(value) {
          setCurrentTab(value);}
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  const handleClear = () => {
    setTabs({});
    setCurrentTab(null);
    setApplicationStatus("Cleared Workspace");
  };

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
    setPage(currentTab, page);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        handleFileOpen={handleFileOpen}
        handleOpenAPIOverlay={() => setShowApiOverlay(true)}
        handleDownload={handleDownload}
        clearFunction={handleClear}
        pagingFunction={() => setShowPagingOverlay(true)}
        columnFunction={() => setShowColumnOverlay(true)}
        rowFunction={() => setShowRowOverlay(true)}
        sortFunction={() => setShowSortOverlay(true)}
        addressBarText={tabs[currentTab]?.displayApi}
      />
      <div className="background h-full overflow-scroll">
        <TabList
          tabs={tabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          removeTab={removeTab}
          overlayFunction={() => setShowApiOverlay(true)}
        />

        <WorkSpace
          tab={tabs[currentTab]}
          handleTableFromLibrary={handleTableFromLibrary}
          setDataset={setDataset}
          updateDisplayApi={updateDisplayApi}
          updateTotal={updateTotal}
          parseNDJSON={parseNDJSON}
        />
      </div>

      <Footer tab={tabs[currentTab]} setPage={handleSetPage} />
      {showApiOverlay && (
        <Overlay
          handleFetchTable={handleFetchTable}
          setShowInputOverlay={setShowApiOverlay}
          errorToast={errorToast}
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
