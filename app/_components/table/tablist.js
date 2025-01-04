import { useDataStore } from "../../_utils/zustand/tablestore";
import { PlusIcon } from "@heroicons/react/24/solid";

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
    <div className="flex gap-1 mb-2">
      {Object.keys(tabs).length > 0 &&
        Object.keys(tabs).map(
          (tabUUID) => (
            console.log("tabUUID", tabUUID),
            console.log("currentTab", currentTab),
            (
              <div
                key={tabUUID}
                className={`bg-custom-beige flex items-center rounded-b-lg shadow-lg  ${
                  currentTab.toString() === tabUUID.toString()
                    ? "bg-white"
                    : "bg-custom-beige"
                }`}
              >
                <button onClick={() => handleTableClick(tabUUID)}>
                  {tabs[tabUUID].datasetOID}
                </button>
                <button
                  onClick={() => handleRemoveTab(tabUUID)}
                  className="ml-1 px-2 py-1 text-xs text-black rounded-full hover:bg-gray-100"
                >
                  X
                </button>
              </div>
            )
          )
        )}
      <div
        className="ml-1 flex items-center bg-custom-beige mt-1 p-3 rounded-full shadow-lg hover:bg-custom-beige-dark cursor-pointer"
        onClick={overlayFunction}
      >
        <div className="h-5 w-5 ">
          <PlusIcon className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
