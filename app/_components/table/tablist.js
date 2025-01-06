import { useDataStore } from "../../_utils/zustand/tablestore";
import { PlusIcon } from "@heroicons/react/24/solid";
import "animate.css";
import "./test.css";

export default function TabList({
  tabs,
  currentTab,
  setCurrentTab,
  removeTab,
  overlayFunction,
}) {
  const { setApplicationStatus } = useDataStore();

  const handleTableClick = (tabUUID) => {
    setCurrentTab(tabUUID);
  };

  const handleRemoveTab = (tabUUID) => {
    setApplicationStatus(`${tabs[tabUUID].datasetOID} Table Closed`);
    removeTab(tabUUID);
  };

  return (
    <div className="flex gap-1 mb-2 ">
      {Object.keys(tabs).length > 0 &&
        Object.keys(tabs).map((tabUUID) => (
          <div
            key={tabUUID}
            className={`bg-custom-beige flex items-center justify-center rounded-b-lg tab ${
              currentTab.toString() === tabUUID
                ? "mt-1 rounded-md bg-gray-100 border-gray-500 border-2 font-bold"
                : "bg-custom-beige"
            }`}
            data-tooltip={
              tabs[tabUUID]?.type === "dataset"
                ? `
              Label: ${tabs[tabUUID]?.dataset.label}
              StudyOID: ${tabs[tabUUID]?.dataset.studyOID}
              Total: ${tabs[tabUUID]?.dataset.records}
              metaDataVersionOID: ${tabs[tabUUID]?.dataset.metaDataVersionOID}
              Creation Date: ${tabs[tabUUID]?.dataset.datasetJSONCreationDateTime}
              Total Pages: ${tabs[tabUUID]?.totalPages}
            `
                : tabs[tabUUID]?.type === "library"
                ? `
              Total: ${tabs[tabUUID]?.dataset.length}
            `
                : ""
            }
          >
            <button
              onClick={() => handleTableClick(tabUUID)}
              className={`${
                currentTab.toString() === tabUUID ? "italic " : ""
              }`}
            >
              {tabs[tabUUID]?.datasetOID}
            </button>
            <button
              onClick={() => handleRemoveTab(tabUUID)}
              className="ml-1 px-2 py-1 text-xs text-black rounded-full hover:bg-gray-100"
            >
              X
            </button>
          </div>
        ))}
      <div
        className="ml-1 flex items-center bg-custom-beige mt-1 p-3 rounded-lg shadow-lg hover:bg-custom-beige-dark cursor-pointer"
        onClick={overlayFunction}
      >
        <div className="h-5 w-5 ">
          <PlusIcon className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
