import React from "react";
import GenericDashboardHeader from "../../shared/components/GenericDashboardHeader";
import { getDataObjectArray } from "../../shared/utils/getDataObject";
import {
  IGenericFormDetails,
  InstanceDashboardProps,
} from "./exportGenericModelDashboardTypes";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericNoDataContainer from "./GenericNoDataContainer";
import GenericDashboardDataDisplay from "./GenericDashboardDataDisplay";
import CustomViewsSideBarMenu from "./CustomViewsSideBarMenu";
import { useGetProcessedData } from "./ViewUtils/useGetProcessedData";
import { Formik, FormikState, FormikValues } from "formik";
import { getInitialValueForField } from "../../shared/utils/getInitialValuesFromList";
import { ICustomField } from "../../../../../models/ICustomField";
import { updateFieldsListDataTypeForFilters } from "../../../../layouts/GenericViewComponentMap";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../../shared/utils/modelNameMapperForParamUrlGenerator";

export const equalsCheck = (a: any[], b: any[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);
export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}
export type SampleModalType = {
  visible: boolean;
  item: Array<any>;
};

export const GenericModelDashboard = ({
  appName,
  modelName,
  user,
  currentModuleLabel,
  fieldsList,
  customModuleViewLoading,
  customModuleViewFieldsList,
  customModuleViewList,
  customModuleViewPermissions,
  modelDataLoading,
  modelData,
  currentModule,
  itemsCount,
  currentDashboardView,
  currentModuleCustomView,
  selectedItems,
  loadingItemCount = 4,
  currentPageNumber,
  customViewsSideBarVisible,
  backgroundProcessRunning = true,
  disableSearchButton,
  deleteModalVisible,
  defaultCustomViewId,
  userPreferences,
  selectedFilterFields,
  customViewFiltersUpdateLoading,
  newDataFoundWithSideNavFilters,
  sortingFieldList,
  updatedNewFiltersForCurrentCustomView,
  foundNewData,
  openingRecordId,
  setOpeningRecordId,
  setSelectedFilterFields,
  setFoundNewData = () => {},
  handleApplyTemparoryFilter = () => {},
  onSelectFilterField,
  setCustomViewsSideBarVisible,
  onPageChange,
  setCurrentModuleCustomView,
  setCurrentDashbaordView,
  setSelectedItems,
  setDeleteModal,
  setDeleteBulkItemsModal,
  setSendEmailModal = () => {},
  handleNewAddedRecord = () => {},
  setActivityFormModal = () => {},
  handleSearchedSelectedItem = () => {},
  handleCustomViewFieldChange,
  setLocalSearchModal,
  KVData,
  kanbanViewPermission,
  KVRecordData,
  setKVRecordData,
  setKVData,
  KViewDataLoading,
  setSortingFieldList,
  handleSorting,
  setExportPdfModal,
  handleAddFiltersToCurrentCustomView = () => {},
  handleAddFiltersToNewCustomView = () => {},
  kanbanViewBulkDeleteRecords,
  setKanbanViewBulkDeleteRecords,
  handleChangeRecordPerPage,
  pageSize,
  pageSizeLoader,
  updateModelFieldData,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  genericModels,
  instances,
  appMessage,
  instanceMessage,
  removeCustomView,
  setCurrentCustomViewById,
  setCurrentCustomViewFilter,
  setCurrentCustomViewId,
  setDefaultCustomViewId,
  importUserPreferences,
  setDisplayConversionModal,
}: InstanceDashboardProps) => {
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const [zIndex, setZIndex] = React.useState<boolean>(false);
  const handleItemSelect = (item: any) => {
    if (selectedItems.filter((sItem) => sItem.id === item.id).length === 0) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((sItem) => sItem.id !== item.id));
    }
  };
  let getInitialValueForFilters: Record<string, any> = {};
  fieldsList?.forEach((field: ICustomField) => {
    getInitialValueForFilters[`value${field.name}`] =
      getInitialValueForField(field);
    getInitialValueForFilters[`operator${field.name}`] =
      (field.dataTypeMetadata?.type === "string" ||
        field.dataTypeMetadata?.type === "record" ||
        field.dataTypeMetadata?.type === "lookup") &&
      field.dataType !== "multiSelectLookup" &&
      field.dataType !== "multiSelectRecordLookup"
        ? "in"
        : "eq";
  });

  const handleMultiItemsSelect = (itemList: any[]) => {
    const deleteSessionData = JSON.parse(
      sessionStorage.getItem("bulkDeleteData") || "{}"
    );
    let updatedSelectedItemsList = [];
    let foundItemsCount = 0;
    for (const item of itemList) {
      const found =
        selectedItems.filter((sItem) => sItem.id === item.id).length === 0
          ? false
          : true;
      if (found) {
        foundItemsCount += 1;
      } else {
        updatedSelectedItemsList.push(item);
      }
    }
    if (foundItemsCount === itemList.length) {
      for (const recordItem of selectedItems) {
        const found =
          itemList.filter((item) => item.id == recordItem.id).length === 0
            ? false
            : true;
        if (!found) {
          let isLinkEnabled = true;
          if (
            !Object.keys(deleteSessionData)?.length ||
            !Object.keys(deleteSessionData?.[modelName] || {})?.length ||
            !recordItem?.id
          ) {
            isLinkEnabled = true;
          } else {
            const idArray: string[] = [];
            for (const key in deleteSessionData?.[modelName]) {
              idArray.push(...deleteSessionData?.[modelName][key]);
            }
            isLinkEnabled = idArray.includes(recordItem.id) ? false : true;
          }
          if (isLinkEnabled) updatedSelectedItemsList.push(recordItem);
        }
      }
    } else {
      updatedSelectedItemsList = [
        ...selectedItems,
        ...getDataObjectArray(updatedSelectedItemsList),
      ];
    }
    setSelectedItems(updatedSelectedItemsList);
  };

  const updatedModelData =
    useGetProcessedData(
      modelData?.length > 0 ? getDataObjectArray(modelData) : [],
      fieldsList?.length > 0 ? fieldsList : [],
      currentPageNumber,
      deleteModalVisible,
      backgroundProcessRunning,
      genericModels,
      foundNewData,
      setFoundNewData
    ) ?? [];

  return (
    <Formik
      initialValues={{ ...getInitialValueForFilters }}
      enableReinitialize
      onSubmit={() => {}}
    >
      {({
        resetForm,
      }: {
        resetForm: (
          nextState?: Partial<FormikState<FormikValues>> | undefined
        ) => void;
      }) => (
        <>
          <div
            className={`shadow-sm px-6 py-0.5 origin-top-right sticky right-0 left-0 top-0 bg-white mb-4 ${
              zIndex ? "z-[501]" : "z-[499]"
            }`}
          >
            <GenericDashboardHeader
              dashboardName={currentModuleLabel}
              currentModule={currentModule}
              itemsCount={itemsCount}
              modelData={modelData}
              loading={
                customModuleViewLoading || customViewFiltersUpdateLoading
              }
              appName={appName}
              modelName={modelName}
              customModuleViewList={customModuleViewList}
              currentDashboardView={currentDashboardView}
              currentModuleCustomView={currentModuleCustomView}
              setCurrentModuleCustomView={setCurrentModuleCustomView}
              setCurrentDashbaordView={setCurrentDashbaordView}
              fieldsList={fieldsList}
              selectedItems={selectedItems}
              customViewsSideBarVisible={customViewsSideBarVisible}
              disableSearchButton={disableSearchButton}
              customViews={customModuleViewList}
              currentCustomView={currentModuleCustomView}
              defaultCustomViewId={defaultCustomViewId}
              userPreferences={userPreferences}
              sortingFieldList={sortingFieldList}
              newDataFoundWithSideNavFilters={newDataFoundWithSideNavFilters}
              setZIndex={(value) => setZIndex(value)}
              setCustomViewsSideBarVisible={(value) => {
                setCustomViewsSideBarVisible(value);
                setSideMeuClass("");
              }}
              deleteSelectedItems={() =>
                setDeleteBulkItemsModal({ visible: true })
              }
              setEmailTemplateModal={(value) => setSendEmailModal(value)}
              handleNewAddedRecord={(data) => handleNewAddedRecord(data)}
              handleSearchedSelectedItem={(item) =>
                handleSearchedSelectedItem(item)
              }
              handleSelectAllItems={() => {
                const updatedSelectedItems = [
                  ...selectedItems,
                  ...getDataObjectArray(modelData),
                ].filter(
                  (value, index, self) =>
                    index === self.findIndex((item) => item.id === value.id)
                );
                setSelectedItems([...updatedSelectedItems]);
              }}
              handleUnselectAllItems={() => setSelectedItems([])}
              setLocalSearchModal={(value) => setLocalSearchModal(value)}
              handleCustomViewFieldChange={handleCustomViewFieldChange}
              KVData={KVData}
              setKVData={setKVData}
              KVRecordData={KVRecordData}
              setExportPdfModal={(value) => setExportPdfModal(value)}
              handleCustomViewSelection={(item) => {
                setCurrentModuleCustomView(item);
                resetForm();
              }}
              KViewDataLoading={KViewDataLoading}
              salesOrderModuleLabel={salesOrderModuleLabel}
              invoiceModuleLabel={invoiceModuleLabel}
              user={user}
              setCurrentCustomViewId={setCurrentCustomViewId}
              setCurrentCustomViewFilter={setCurrentCustomViewFilter}
              setDisplayConversionModal={setDisplayConversionModal}
              setCurrentCustomViewById={setCurrentCustomViewById}
              setDefaultCustomViewId={setDefaultCustomViewId}
              removeCustomView={removeCustomView}
              importUserPreferences={importUserPreferences}
            />
          </div>
          <div
            className={`sidebar w-full min-h-screen overflow-y-scroll absolute inset-y-0 left-0 lg:hidden transform ${sideMenuClass} transition duration-200 ease-in-out z-[600]`}
          >
            <div
              className={`shadow-lg w-[70vw] sm:w-[33.3vw] h-screen bg-white text-black p-4`}
            >
              <CustomViewsSideBarMenu
                user={user}
                customViews={customModuleViewList}
                currentCustomView={currentModuleCustomView}
                customModuleViewPermissions={customModuleViewPermissions}
                fieldsList={updateFieldsListDataTypeForFilters(fieldsList)}
                sortingFieldList={sortingFieldList}
                setSortingFieldList={setSortingFieldList}
                selectedFilterFields={selectedFilterFields}
                customViewFiltersUpdateLoading={customViewFiltersUpdateLoading}
                setSideMenuClass={setSideMeuClass}
                onSelectFilterField={onSelectFilterField}
                handleApplyTemparoryFilter={handleApplyTemparoryFilter}
                handleClearFilters={() => {
                  resetForm();
                }}
                setSelectedFilterFields={setSelectedFilterFields}
                userPreferences={userPreferences}
                appMessage={appMessage}
                instanceMessage={instanceMessage}
              />
            </div>
          </div>
          <div
            className={`fixed inset-y-0 shadow-md left-0 ${
              appMessage?.length > 0 && instanceMessage?.length > 0
                ? `h-[78vh] 2xl:h-[82vh] 4xl:h-[84vh] mt-[160px]`
                : appMessage?.length > 0 || instanceMessage?.length > 0
                ? "h-[80vh] 2xl:h-[85vh] 4xl:h-[86vh] mt-[140px]"
                : "h-[83vh] 2xl:h-[87vh] 4xl:h-[88vh] mt-[120px]"
            } hidden bg-white lg:w-[20vw] xl:w-[16.67vw]  py-2 z-[500] ${
              customViewsSideBarVisible ? "lg:block" : ""
            } ${customModuleViewPermissions ? "px-2" : ""}`}
          >
            <CustomViewsSideBarMenu
              user={user}
              customViews={customModuleViewList}
              currentCustomView={currentModuleCustomView}
              customModuleViewPermissions={customModuleViewPermissions}
              fieldsList={updateFieldsListDataTypeForFilters(fieldsList)}
              sortingFieldList={sortingFieldList}
              setSortingFieldList={setSortingFieldList}
              selectedFilterFields={selectedFilterFields}
              customViewFiltersUpdateLoading={customViewFiltersUpdateLoading}
              onSelectFilterField={onSelectFilterField}
              handleApplyTemparoryFilter={handleApplyTemparoryFilter}
              handleClearFilters={() => {
                resetForm();
              }}
              setSelectedFilterFields={setSelectedFilterFields}
              userPreferences={userPreferences}
              appMessage={appMessage}
              instanceMessage={instanceMessage}
            />
          </div>
          <div
            className={`flex flex-col w-full h-full ${
              customViewsSideBarVisible
                ? "lg:w-[80vw] xl:w-[83.3vw] lg:ml-1/5 xl:ml-1/6"
                : ""
            }`}
          >
            <div className="flex flex-col w-full h-full" id="parent-container">
              <div className={`px-6 py-0`}>
                {modelDataLoading || pageSizeLoader ? (
                  <ItemsLoader
                    currentView={currentDashboardView}
                    loadingItemCount={loadingItemCount}
                  />
                ) : !modelDataLoading && modelData?.length > 0 ? (
                  <GenericDashboardDataDisplay
                    appName={appName}
                    modelName={modelName}
                    modelData={
                      !equalsCheck(
                        updatedModelData.map((data) => {
                          return data?.id;
                        }),
                        modelData?.map((data) => {
                          return data?.id;
                        })
                      )
                        ? modelData
                        : updatedModelData?.length > 0
                        ? updatedModelData
                        : modelData
                    }
                    backgroundProcessRunning={backgroundProcessRunning}
                    currentModuleCustomView={currentModuleCustomView}
                    currentDashboardView={currentDashboardView}
                    currentPageNumber={currentPageNumber}
                    onPageChange={(pageNumber) => {
                      onPageChange(pageNumber);
                    }}
                    itemsCount={itemsCount}
                    fieldsList={fieldsList}
                    sortingFieldList={sortingFieldList}
                    foundNewData={foundNewData}
                    openingRecordId={openingRecordId}
                    setOpeningRecordId={setOpeningRecordId}
                    setFoundNewData={setFoundNewData}
                    setSortingFieldList={setSortingFieldList}
                    currentCustomView={currentModuleCustomView}
                    selectedFilterFields={selectedFilterFields}
                    newDataFoundWithSideNavFilters={
                      newDataFoundWithSideNavFilters
                    }
                    handleAddFiltersToCurrentCustomView={
                      handleAddFiltersToCurrentCustomView
                    }
                    handleAddFiltersToNewCustomView={
                      handleAddFiltersToNewCustomView
                    }
                    handleApplyTemparoryFilter={handleApplyTemparoryFilter}
                    customModuleViewFieldsList={customModuleViewFieldsList}
                    updatedNewFiltersForCurrentCustomView={
                      updatedNewFiltersForCurrentCustomView
                    }
                    handleSorting={handleSorting}
                    setDeleteModal={(value) => {
                      setDeleteModal(value);
                    }}
                    dataProcessed={true}
                    dataProcessing={updatedModelData?.length > 0 ? false : true}
                    setActivityFormModal={(value) => {
                      setActivityFormModal(value);
                    }}
                    selectedItems={selectedItems}
                    onItemSelect={(value) => {
                      handleItemSelect(value);
                    }}
                    onMultiItemSelect={(value: any[]) =>
                      handleMultiItemsSelect(value)
                    }
                    selectAllItems={() =>
                      selectedItems.length === modelData.length
                        ? () => {
                            setSelectedItems([]);
                          }
                        : () => {
                            setSelectedItems(getDataObjectArray(modelData));
                          }
                    }
                    setSelectItemsOnAllPages={(items) => {
                      setSelectedItems(items);
                    }}
                    currentModuleLabel={currentModuleLabel}
                    loadingItemCount={loadingItemCount}
                    KVData={KVData}
                    kanbanViewPermission={kanbanViewPermission}
                    KVRecordData={KVRecordData}
                    setKVRecordData={setKVRecordData}
                    KViewDataLoading={KViewDataLoading}
                    deleteModalVisible={deleteModalVisible}
                    kanbanViewBulkDeleteRecords={kanbanViewBulkDeleteRecords}
                    setKanbanViewBulkDeleteRecords={
                      setKanbanViewBulkDeleteRecords
                    }
                    customViewFiltersUpdateLoading={
                      customViewFiltersUpdateLoading
                    }
                    handleChangeRecordPerPage={handleChangeRecordPerPage}
                    pageSize={pageSize}
                    updateModelFieldData={updateModelFieldData}
                    salesOrderModuleLabel={salesOrderModuleLabel}
                    invoiceModuleLabel={invoiceModuleLabel}
                    genericModels={genericModels}
                    instances={instances}
                    setDisplayConversionModal={setDisplayConversionModal}
                  />
                ) : backgroundProcessRunning ? (
                  <ItemsLoader
                    currentView={currentDashboardView}
                    loadingItemCount={loadingItemCount}
                  />
                ) : (
                  <>
                    {(newDataFoundWithSideNavFilters ||
                      (sortingFieldList && sortingFieldList?.length > 0)) && (
                      <div className="max-w-[14rem]">
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
                      </div>
                    )}
                    <GenericNoDataContainer
                      appName={appName}
                      modelName={modelName}
                      moduleLabel={currentModuleLabel}
                      messageType={"view"}
                      additionalParts={
                        modelNameValuesWithSystemSubForm.includes(modelName)
                          ? [
                              `?subform=${
                                modelNameMapperForParamURLGenerator(modelName)
                                  ?.subForm
                              }&&dependingModule=product`,
                            ]
                          : []
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};
