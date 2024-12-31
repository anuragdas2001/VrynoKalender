import GenericList from "../../../components/TailwindControls/Lists/GenericList";
import { useTranslation } from "next-i18next";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import Pagination from "../crm/shared/components/Pagination";
import { IBaseModuleRecord } from "../../../models/shared";
import { SupportedDataTypes } from "../../../models/ICustomField";
import ItemsLoader from "../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import NoDataFoundContainer from "../crm/shared/components/NoDataFoundContainer";
import { camelCase } from "change-case";
import { get } from "lodash";
import GenericBackHeader from "../crm/shared/components/GenericBackHeader";
import { SideDrawer } from "../crm/shared/components/SideDrawer";
import React, { useEffect, useRef } from "react";
import RecycleBinSideMenu from "./RecycleBinSideMenu";
import { setHeight } from "../crm/shared/utils/setHeight";
import { determineShowSelectItem } from "../crm/generic/GenericModelView/GenericDashboardDataDisplay";
import { Loading } from "../../../components/TailwindControls/Loading/Loading";
import { getNavigationLabel } from "../crm/shared/utils/getNavigationLabel";
import { RecycleBinItemListProps } from "./RecycleBinScreen";

export const RecycleBinItemList = ({
  itemsCount,
  currentPageNumber,
  deletedRecords,
  selectedItems,
  selectAllItems,
  sideMenuLoading,
  pageLoading,
  modelName,
  sideMenuItems,
  fieldsList,
  getAllItemsFetchLoading = false,
  setSelectedItems = () => {},
  onMenuItemChange = () => {},
  selectItemHandler = () => {},
  onPageChange = () => {},
  deleteSelectedItemsPermanently = () => {},
  restoreSelectedItemsBack = () => {},
  handleSelectItemsOnAllPages = () => {},
  navigations,
  currentLabel,
}: RecycleBinItemListProps) => {
  const { t } = useTranslation(["recyle-bin", "common"]);
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");

  const tableHeaders = [
    {
      columnName: "name",
      label: "Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "updatedBy",
      label: "Deleted By",
      dataType: SupportedDataTypes.recordLookup,
    },
    {
      columnName: "updatedAt",
      label: "Deleted Time",
      dataType: SupportedDataTypes.datetime,
    },
  ];

  const checkIfAnyRecordInCurrentPageNotSelected = (
    deletedRecords: IBaseModuleRecord[],
    selectedItems: IBaseModuleRecord[]
  ) => {
    let checkIfAnyItemNotSelected = false;
    deletedRecords?.forEach((record) => {
      const findIndex = selectedItems?.findIndex(
        (item) => item.id === record.id
      );
      if (findIndex === -1) checkIfAnyItemNotSelected = true;
    });
    return checkIfAnyItemNotSelected;
  };

  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 60);
    }
  }, [deletedRecords]);

  return (
    <div className="flex w-full">
      <RecycleBinSideMenu
        menuItems={sideMenuItems
          ?.filter(
            (item) =>
              item.navType === "module" ||
              (item.navType === "link" && item.uniqueName === "report")
          )
          .map((item) => {
            if (item.navType === "link") {
              return {
                label: item.label?.en,
                name: camelCase(get(item, "uniqueName", "")),
              };
            } else {
              return {
                label: item.label?.en,
                name: camelCase(get(item.navTypeMetadata, "moduleName", "")),
              };
            }
          })}
        onMenuItemChange={(item) => onMenuItemChange(item)}
        modelName={modelName?.replace("rb", "")}
        menuLoading={sideMenuLoading}
      />
      <div className="flex flex-col w-full sm:w-8/12 md:w-9/12 lg:w-4/5 xl:w-10/12 h-full sm:ml-4/12 md:ml-3/12 lg:ml-1/5 xl:ml-2/12">
        <GenericBackHeader heading="Recycle Bin" addButtonInFlexCol={true}>
          <div className="flex gap-x-6 justify-between mt-2">
            <Button
              type="button"
              id="recycle-restore"
              onClick={() => restoreSelectedItemsBack()}
              kind="primary"
              buttonType="thin"
              disabled={!selectedItems.length}
              userEventName="recycleBin-restore-click"
            >
              {t("Restore")}
            </Button>
            <Button
              type="button"
              id="recycle-delete"
              onClick={() => deleteSelectedItemsPermanently()}
              kind="next"
              buttonType="thin"
              disabled={!selectedItems.length}
              userEventName="recycleBin-delete-click"
            >
              {t("Delete")}
            </Button>
          </div>
        </GenericBackHeader>
        <div className="sm:hidden w-40 mt-4">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType={"thin"}
            menuItems={sideMenuItems.map((item) => {
              return {
                label: item.label?.en,
                name: camelCase(get(item.navTypeMetadata, "moduleName", "")),
              };
            })}
            onMenuItemChange={(item) => onMenuItemChange(item)}
            modelName={modelName}
            menuLoading={sideMenuLoading}
          />
        </div>
        <div className={`pt-4 px-6`}>
          <div
            className={`flex gap-x-2 items-center w-full ${
              pageLoading || deletedRecords.length === 0 ? "hidden" : ""
            } mb-2`}
          >
            <Button
              id="recycle-bin-select-all"
              customStyle={`cursor-pointer flex whitespace-nowrap items-center ${
                checkIfAnyRecordInCurrentPageNotSelected(
                  deletedRecords,
                  selectedItems
                )
                  ? ""
                  : "hidden"
              }`}
              onClick={() => selectAllItems()}
              userEventName="recycleBin-select-all:action-click"
            >
              <>
                <input
                  type="checkbox"
                  name="list_checkbox"
                  checked={false}
                  className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
                  style={{ width: "18px", height: "18px" }}
                />
                <span className="pl-2">Select All</span>
              </>
            </Button>
            <Button
              id="recycle-bin-unselect-all"
              customStyle={`cursor-pointer flex whitespace-nowrap items-center ${
                selectedItems?.length === 0 ? "hidden" : ""
              }`}
              onClick={() => setSelectedItems([])}
              userEventName="recycleBin-unselect-all:action-click"
            >
              <>
                <input
                  type="checkbox"
                  name="list_checkbox"
                  checked={true}
                  className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
                  style={{ width: "18px", height: "18px" }}
                />
                <span className="pl-2">Unselect All</span>
              </>
            </Button>
            <div className="w-full">
              {selectedItems.length !== itemsCount &&
                !determineShowSelectItem(deletedRecords, selectedItems) && (
                  <div
                    className={`w-full text-xsm hidden sm:flex items-center justify-center`}
                  >
                    <span className="pr-2 text-vryno-label-gray-secondary">
                      {getAllItemsFetchLoading
                        ? "Please wait while we select all items ..."
                        : "Selected all items on this page"}
                    </span>
                    {getAllItemsFetchLoading ? (
                      <div className="pl-4">
                        <Loading color="Blue" />
                      </div>
                    ) : (
                      <Button
                        id="select-all-items"
                        customStyle="border-l border-gray-400 pl-2 text-vryno-theme-light-blue"
                        onClick={() =>
                          handleSelectItemsOnAllPages(itemsCount, 50)
                        }
                        userEventName="recycleBin-selectAll-records-click"
                        renderChildrenOnly={true}
                      >{`Select all ${itemsCount} records`}</Button>
                    )}
                  </div>
                )}
            </div>
            {itemsCount > 0 && (
              <Pagination
                itemsCount={itemsCount}
                currentPageNumber={currentPageNumber}
                currentPageItemCount={deletedRecords.length}
                onPageChange={(pageNumber) => onPageChange(pageNumber)}
              />
            )}
          </div>
          {pageLoading ? (
            <ItemsLoader currentView="List" loadingItemCount={4} />
          ) : deletedRecords.length === 0 ? (
            <NoDataFoundContainer
              modelName={"Recycle Bin"}
              containerMessage={`No Deleted ${getNavigationLabel({
                navigations: navigations,
                currentModuleName: currentLabel,
                currentModuleLabel: currentLabel,
                defaultLabel: modelName?.replace("rb", ""),
              })}`}
              showButton={false}
            />
          ) : (
            <div className="p-4 bg-white rounded-xl">
              <div
                className="flex flex-col lg:flex-row bg-white pr-1 overflow-y-auto card-scroll"
                ref={heightRef}
              >
                {!fieldsList?.length ? (
                  <ItemsLoader currentView="List" loadingItemCount={4} />
                ) : (
                  <GenericList
                    tableHeaders={tableHeaders}
                    data={deletedRecords}
                    selectedItems={selectedItems}
                    selectAllItems={() => selectAllItems()}
                    onItemSelect={(value) => selectItemHandler(value)}
                    onDetail={false}
                    showIcons={false}
                    fieldsList={fieldsList}
                    allowNewGridInBuiltSorting={true}
                    checkForMassDelete={{
                      check: true,
                      sessionStorageKeyName: "bulkProcessRecycleBinData",
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
