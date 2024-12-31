import React, { useEffect, useRef, useState } from "react";
import { getDataObjectArray } from "../../shared/utils/getDataObject";
import {
  getAllCustomViewFieldsArray,
  getAllFieldsObjectArrayForModal,
  getVisibleFieldsArray,
} from "../../shared/utils/getFieldsArray";
import GenericModelCardItems from "./GenericModalCardItems";
import GenericModelList from "./GenericModelList";
import Pagination from "../../shared/components/Pagination";
import { SupportedDashboardViews } from "../../../../../models/shared";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { setHeight } from "../../shared/utils/setHeight";
import { Loading } from "../../../../../components/TailwindControls/Loading/Loading";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { getNavigationLabel } from "../../shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { ConnectedKanbanView } from "../GenericKanbanView/ConnectedKanbanView";
import { checkModuleNavVisibility } from "../../shared/utils/checkModuleNavVisibility";
import { GenericDashboardDataDisplayProps } from "./genericDashboardDataDisplayProps";

export const determineShowSelectItem = (
  modelData: Partial<{ id: string }>[],
  selectedItems: Partial<{ id: string }>[]
) => {
  const modelItemsInSelectedItemsLength = modelData
    .map((data) => {
      if (selectedItems.filter((item) => item.id === data.id)?.length > 0) {
        return data;
      }
    })
    ?.filter((item) => item)?.length;

  return modelItemsInSelectedItemsLength === modelData.length ? false : true;
};

const GenericDashboardDataDisplay = ({
  modelData,
  appName,
  modelName,
  currentModuleCustomView,
  fieldsList,
  currentDashboardView,
  selectedItems,
  currentPageNumber,
  backgroundProcessRunning,
  itemsCount,
  dataProcessed,
  dataProcessing,
  sortingFieldList = [],
  currentModuleLabel,
  loadingItemCount,
  KVData,
  kanbanViewPermission,
  KVRecordData,
  KViewDataLoading,
  deleteModalVisible,
  updatedNewFiltersForCurrentCustomView,
  currentCustomView,
  newDataFoundWithSideNavFilters,
  selectedFilterFields,
  foundNewData,
  customViewFiltersUpdateLoading,
  openingRecordId,
  setOpeningRecordId,
  setFoundNewData = () => {},
  handleApplyTemparoryFilter = () => {},
  setSortingFieldList = () => {},
  handleAddFiltersToCurrentCustomView = () => {},
  handleAddFiltersToNewCustomView = () => {},
  handleSorting = () => {},
  setKVRecordData,
  onPageChange,
  onItemSelect,
  onMultiItemSelect,
  setDeleteModal,
  setActivityFormModal,
  setSelectItemsOnAllPages,
  kanbanViewBulkDeleteRecords,
  setKanbanViewBulkDeleteRecords,
  handleChangeRecordPerPage,
  pageSize,
  updateModelFieldData,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  genericModels,
  instances,
  setDisplayConversionModal,
}: GenericDashboardDataDisplayProps) => {
  const [getAllItemsFetchLoading, setGetAllItemsFetchLoading] =
    useState<boolean>(false);
  const [getDataList] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const { navigations } = React.useContext(NavigationStoreContext);
  const [navActivityModuleLabels, setNavActivityModuleLabel] = React.useState({
    task: "Task",
    meeting: "Meeting",
    callLog: "Call Log",
  });

  React.useEffect(() => {
    setNavActivityModuleLabel({
      task: checkModuleNavVisibility(navigations, "task")
        ? getNavigationLabel({
            navigations: navigations,
            currentModuleName: "task",
            currentModuleLabel: "Task",
            defaultLabel: "Task",
          })
        : null,
      meeting: checkModuleNavVisibility(navigations, "meeting")
        ? getNavigationLabel({
            navigations: navigations,
            currentModuleName: "meeting",
            currentModuleLabel: "Meeting",
            defaultLabel: "Meeting",
          })
        : null,
      callLog: checkModuleNavVisibility(navigations, "callLog")
        ? getNavigationLabel({
            navigations: navigations,
            currentModuleName: "callLog",
            currentModuleLabel: "Call Log",
            defaultLabel: "Call Log",
          })
        : null,
    });
  }, [navigations?.length]);

  const handleAllItemsSelectFetch = async (
    totalItems: number,
    pageSize: number
  ) => {
    setGetAllItemsFetchLoading(true);
    const pagesCount = Math.ceil(totalItems / pageSize);
    let i = 0;
    let selectItemsOnAllPages: any[] = [];
    while (i < pagesCount) {
      await getDataList({
        variables: {
          customViewId: currentModuleCustomView?.id,
          modelName: modelName,
          fields: getVisibleFieldsArray(fieldsList),
          filters: [],
          pageNumber: i + 1,
        },
      }).then((response) => {
        if (response?.data?.fetch?.messageKey.includes("success")) {
          selectItemsOnAllPages = [
            ...selectItemsOnAllPages,
            ...response.data.fetch.data,
          ];
        }
      });
      i++;
    }
    setGetAllItemsFetchLoading(false);
    setSelectItemsOnAllPages(selectItemsOnAllPages);
  };

  const heightRefOne = useRef(null);
  const heightRefTwo = useRef(null);
  useEffect(() => {
    if (heightRefOne) {
      setHeight(heightRefOne, 20);
    }
  }, [currentDashboardView, modelData]);

  useEffect(() => {
    if (heightRefTwo) {
      setHeight(heightRefTwo, 20);
    }
  }, [currentDashboardView]);

  const saveViewButton = !currentCustomView?.systemDefined &&
    (newDataFoundWithSideNavFilters || sortingFieldList?.length > 0) && (
      <Button
        kind="next"
        buttonType="thin"
        id="save-existing-view"
        userEventName="save-existing-view-button-clicked"
        onClick={() => handleAddFiltersToCurrentCustomView()}
      >
        <span className="flex gap-x-1 items-center whitespace-nowrap overflow-hidden">{`Save Existing View`}</span>
      </Button>
    );

  const saveNewViewButton = (newDataFoundWithSideNavFilters ||
    sortingFieldList?.length > 0) && (
    <Button
      kind="next"
      buttonType="thin"
      id="save-as-new-view"
      userEventName="save-as-new-view-button-clicked"
      onClick={() => handleAddFiltersToNewCustomView()}
    >
      <span className="flex gap-x-1 items-center whitespace-nowrap overflow-hidden">
        Save as New View
      </span>
    </Button>
  );

  const clearButton = sortingFieldList?.length > 0 && (
    <Button
      kind="back"
      buttonType="thin"
      id="cancel-sorting-filter"
      userEventName="cancel-sorting-button-clicked"
      onClick={() => {
        handleApplyTemparoryFilter(
          updatedNewFiltersForCurrentCustomView
            ? updatedNewFiltersForCurrentCustomView
            : [],
          []
        );
        setSortingFieldList([]);
      }}
    >
      <span className="flex gap-x-1 items-center whitespace-nowrap overflow-hidden">
        {`Clear`}
      </span>
    </Button>
  );

  return (
    <>
      {currentDashboardView !== SupportedDashboardViews.Kanban ? (
        <div className="hidden sm:flex">
          <div className="flex gap-x-2 mr-2">
            {clearButton}
            {saveViewButton}
            {saveNewViewButton}
          </div>
          <Pagination
            itemsCount={itemsCount}
            currentPageItemCount={modelData.length}
            pageSize={pageSize}
            onPageChange={(pageNumber) => {
              onPageChange(pageNumber);
            }}
            currentPageNumber={currentPageNumber}
            pageInfoLocation="between"
            backgroundProcessRunning={backgroundProcessRunning}
            handleChangeRecordPerPage={handleChangeRecordPerPage}
          >
            <>
              {selectedItems.length !== itemsCount &&
                !determineShowSelectItem(modelData, selectedItems) && (
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
                          handleAllItemsSelectFetch(itemsCount, 50)
                        }
                        userEventName="generic-dashboard-selectAll-records-click"
                        renderChildrenOnly={true}
                      >{`Select all ${itemsCount} records`}</Button>
                    )}
                  </div>
                )}
            </>
          </Pagination>
        </div>
      ) : (
        <></>
      )}
      {currentDashboardView !== SupportedDashboardViews.Kanban ? (
        <div className={`sm:hidden flex flex-col`}>
          <div className="flex items-center justify-between">
            {clearButton}
            {saveViewButton}
            {saveNewViewButton}
          </div>
          <Pagination
            itemsCount={itemsCount}
            currentPageItemCount={modelData.length}
            pageSize={pageSize}
            onPageChange={(pageNumber) => {
              onPageChange(pageNumber);
            }}
            currentPageNumber={currentPageNumber}
            backgroundProcessRunning={backgroundProcessRunning}
            handleChangeRecordPerPage={handleChangeRecordPerPage}
          />
          {selectedItems.length !== itemsCount &&
            !determineShowSelectItem(modelData, selectedItems) && (
              <div
                className={`w-full text-[12px] sm:hidden flex items-center justify-center mt-2`}
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
                    onClick={() => handleAllItemsSelectFetch(itemsCount, 50)}
                    userEventName="generic-dashboard-selectAll-records-click"
                    renderChildrenOnly={true}
                  >{`Select all ${itemsCount} records`}</Button>
                )}
              </div>
            )}
        </div>
      ) : (
        <></>
      )}
      {currentDashboardView === SupportedDashboardViews.Card ? (
        <div className="mt-3 rounded-xl">
          <div
            ref={heightRefTwo}
            className="overflow-y-auto pr-1 card-scroll-track"
          >
            <GenericModelCardItems
              modelData={getDataObjectArray(modelData)}
              appName={appName}
              modelName={modelName}
              fieldsList={
                currentModuleCustomView?.id === "all-fields"
                  ? getSortedFieldList(
                      fieldsList?.map((field) => {
                        if (
                          [
                            "createdAt",
                            "updatedAt",
                            "createdBy",
                            "updatedBy",
                          ].includes(field.name) &&
                          field.systemDefined
                        ) {
                          return { ...field, order: Infinity };
                        } else return field;
                      })
                    )
                  : fieldsList
              }
              customViewFieldsList={
                currentModuleCustomView?.id === "all-fields"
                  ? getSortedFieldList(
                      fieldsList?.map((field) => {
                        if (
                          [
                            "createdAt",
                            "updatedAt",
                            "createdBy",
                            "updatedBy",
                          ].includes(field.name) &&
                          field.systemDefined
                        ) {
                          return { ...field, order: Infinity };
                        } else return field;
                      })
                    )?.map((field) => field.name)
                  : currentModuleCustomView?.moduleFields
              }
              openingRecordId={openingRecordId}
              setOpeningRecordId={setOpeningRecordId}
              setDeleteModal={setDeleteModal}
              setFormModal={setActivityFormModal}
              selectedItems={selectedItems}
              dataProcessed={dataProcessed}
              dataProcessing={dataProcessing}
              onItemSelect={(value) => onItemSelect(value)}
              currentModuleLabel={currentModuleLabel}
              navActivityModuleLabels={navActivityModuleLabels}
              salesOrderModuleLabel={salesOrderModuleLabel}
              invoiceModuleLabel={invoiceModuleLabel}
              setDisplayConversionModal={setDisplayConversionModal}
            />
          </div>
        </div>
      ) : currentDashboardView === SupportedDashboardViews.List ? (
        <div className="bg-white pt-4 pb-1 px-4 rounded-xl mt-2">
          <div ref={heightRefOne}>
            {modelData ? (
              <GenericModelList
                appName={appName}
                modelName={modelName}
                data={getDataObjectArray(modelData)}
                fieldsList={fieldsList}
                sortingFieldList={sortingFieldList}
                dataProcessed={dataProcessed}
                dataProcessing={dataProcessing}
                openingRecordId={openingRecordId}
                setOpeningRecordId={setOpeningRecordId}
                tableHeaders={
                  currentModuleCustomView?.moduleFields.length
                    ? [
                        ...getAllCustomViewFieldsArray(
                          fieldsList,
                          currentModuleCustomView?.id === "all-fields"
                            ? getSortedFieldList(
                                fieldsList?.map((field) => {
                                  if (
                                    [
                                      "createdAt",
                                      "updatedAt",
                                      "createdBy",
                                      "updatedBy",
                                    ].includes(field.name) &&
                                    field.systemDefined
                                  ) {
                                    return { ...field, order: Infinity };
                                  } else return field;
                                })
                              )?.map((field) => field.name)
                            : currentModuleCustomView?.moduleFields,
                          []
                        ),
                      ]
                    : [
                        ...getAllFieldsObjectArrayForModal(
                          getSortedFieldList(
                            fieldsList?.map((field) => {
                              if (
                                [
                                  "createdAt",
                                  "updatedAt",
                                  "createdBy",
                                  "updatedBy",
                                ].includes(field.name) &&
                                field.systemDefined
                              ) {
                                return { ...field, order: Infinity };
                              } else return field;
                            })
                          ),
                          "",
                          []
                        ),
                      ]
                }
                setDeleteModal={(value) => {
                  setDeleteModal(value);
                }}
                handleSorting={handleSorting}
                setFormModal={(value) => setActivityFormModal(value)}
                selectedItems={selectedItems}
                setSelectItemsOnAllPages={() => setSelectItemsOnAllPages([])}
                onItemSelect={(value) => onItemSelect(value)}
                currentModuleLabel={currentModuleLabel}
                navActivityModuleLabels={navActivityModuleLabels}
                updateModelFieldData={updateModelFieldData}
                salesOrderModuleLabel={salesOrderModuleLabel}
                invoiceModuleLabel={invoiceModuleLabel}
                setDisplayConversionModal={setDisplayConversionModal}
              />
            ) : null}
          </div>
        </div>
      ) : currentDashboardView === SupportedDashboardViews?.Kanban ? (
        <ConnectedKanbanView
          appName={appName}
          modelName={modelName}
          KVData={KVData}
          kanbanViewPermission={kanbanViewPermission}
          KVRecordData={KVRecordData}
          setKVRecordData={setKVRecordData}
          fieldsList={fieldsList}
          loadingItemCount={loadingItemCount}
          selectedItems={selectedItems}
          dataProcessed={dataProcessed}
          dataProcessing={dataProcessing}
          updatedNewFiltersForCurrentCustomView={
            updatedNewFiltersForCurrentCustomView
          }
          foundNewData={foundNewData}
          openingRecordId={openingRecordId}
          setOpeningRecordId={setOpeningRecordId}
          setFoundNewData={setFoundNewData}
          onItemSelect={(value) => onItemSelect(value)}
          onMultiItemSelect={onMultiItemSelect}
          KViewDataLoading={KViewDataLoading}
          deleteModalVisible={deleteModalVisible}
          backgroundProcessRunning={backgroundProcessRunning}
          setSelectItemsOnAllPages={setSelectItemsOnAllPages}
          kanbanViewBulkDeleteRecords={kanbanViewBulkDeleteRecords}
          genericModels={genericModels}
          instances={instances}
          setKanbanViewBulkDeleteRecords={setKanbanViewBulkDeleteRecords}
        />
      ) : (
        <></>
      )}
    </>
  );
};
export default GenericDashboardDataDisplay;
