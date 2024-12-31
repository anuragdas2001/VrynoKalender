import React from "react";
import { useRouter } from "next/router";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import ImportIcon from "remixicon-react/LoginBoxLineIcon";
import MassEmailIcon from "remixicon-react/MailSendLineIcon";
import MassUpdateIcon from "remixicon-react/ListCheck2Icon";
import MoreDataIcon from "remixicon-react/More2FillIcon";
import ButtonWithDropdown from "../../../../../components/TailwindControls/Form/Button/ButtonWithDropdown";
import ViewButtonLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ViewButtonLoader";
import { appsUrlGenerator } from "../utils/appsUrlGenerator";
import {
  ICustomView,
  IGenericConversionFormData,
  IKanbanViewData,
  IUserPreference,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import FieldsIcon from "remixicon-react/FileListLineIcon";
import { AllowedViews } from "../../../../../models/allowedViews";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { sliderWindowType } from "./SliderWindow";
import { GenericDashboardHeaderContent } from "./GenericDashboardHeaderContent";
import DashboardViewSelector from "./DashboardViewSelector";
import { ICustomViewFilter } from "../../generic/GenericAddCustomView/customViewHelpers/customFilterHelper";
import { User } from "../../../../../models/Accounts";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../utils/modelNameMapperForParamUrlGenerator";

export type ViewSelection = {
  id: string;
  modelName: string;
  fields: Array<string>;
  filters: Array<any>;
  orderBy: Array<any>;
  routingAddress: string;
};

export type GenericDashboardHeaderProps = {
  dashboardName: string;
  loading?: boolean;
  appName: SupportedApps;
  modelName: string;
  modelData: Array<any>;
  itemsCount: number;
  customModuleViewList: Array<ICustomView>;
  currentDashboardView: SupportedDashboardViews;
  currentModuleCustomView: ICustomView | undefined;
  fieldsList: Array<ICustomField>;
  currentModule?: IModuleMetadata;
  selectedItems: any[];
  customViewsSideBarVisible: boolean;
  disableSearchButton: boolean;
  newDataFoundWithSideNavFilters?: boolean;
  customViews: ICustomView[];
  currentCustomView?: ICustomView;
  defaultCustomViewId: string | undefined;
  userPreferences: IUserPreference[];
  sortingFieldList:
    | {
        name: string;
        order: "ASC" | "DESC" | "None";
      }[]
    | undefined;
  setZIndex?: (value: boolean) => void;
  setCustomViewsSideBarVisible: (value: boolean) => void;
  setEmailTemplateModal?: (value: boolean) => void;
  deleteSelectedItems?: (value: boolean) => void;
  setCurrentDashbaordView: React.Dispatch<
    React.SetStateAction<SupportedDashboardViews>
  >;
  setCurrentModuleCustomView: (item: ICustomView) => void;
  handleNewAddedRecord?: (data: any) => void;
  handleSearchedSelectedItem?: (items: Record<string, string>[]) => void;
  handleSelectAllItems: () => void;
  handleUnselectAllItems: () => void;
  setLocalSearchModal: (value: sliderWindowType) => void;
  handleCustomViewFieldChange: (customView: ICustomView) => void;
  KVData: IKanbanViewData | null;
  setKVData: (value: IKanbanViewData) => void;
  KVRecordData: any[];
  setExportPdfModal: (value: boolean) => void;
  handleCustomViewSelection: (item: any) => void;
  KViewDataLoading: boolean;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  user: User | null;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
  setCurrentCustomViewId: (
    customViewId: string | undefined,
    moduleName: string
  ) => void;
  setCurrentCustomViewFilter: (
    customViewFilterData: {
      filters: ICustomViewFilter[];
      expression: string | null;
    },
    moduleName: string
  ) => void;
  setCurrentCustomViewById: (customViewId: string, moduleName: string) => void;
  setDefaultCustomViewId: (
    customViewId: string | undefined,
    moduleName: string
  ) => void;
  removeCustomView: (customView: ICustomView, moduleName: string) => void;
  importUserPreferences: (userPreferences: IUserPreference[]) => void;
};

const GenericDashboardHeader = ({
  dashboardName,
  loading = false,
  appName,
  modelName,
  modelData,
  currentDashboardView,
  currentModuleCustomView,
  itemsCount,
  fieldsList,
  selectedItems,
  customViewsSideBarVisible,
  disableSearchButton,
  newDataFoundWithSideNavFilters,
  customViews,
  currentCustomView,
  defaultCustomViewId,
  userPreferences,
  sortingFieldList,
  user,
  setCurrentCustomViewById,
  setCurrentCustomViewFilter,
  setCurrentCustomViewId,
  setCurrentModuleCustomView,
  setDefaultCustomViewId,
  importUserPreferences,
  removeCustomView,
  setZIndex = () => {},
  setCustomViewsSideBarVisible = () => {},
  deleteSelectedItems = () => {},
  setEmailTemplateModal = () => {},
  setCurrentDashbaordView,
  handleSelectAllItems,
  handleUnselectAllItems,
  setLocalSearchModal,
  handleCustomViewFieldChange,
  KVData,
  setKVData,
  KVRecordData,
  setExportPdfModal,
  handleCustomViewSelection = () => {},
  KViewDataLoading,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  setDisplayConversionModal,
}: GenericDashboardHeaderProps) => {
  const router = useRouter();

  const massUpdateObject = {
    icon: (
      <MassUpdateIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
    ),
    label: `Mass Update`,
    onClick: () => {
      router.push(`${appName}/${modelName}/massupdate`);
    },
    labelClasses: "text-vryno-dropdown-icon",
    visible: true,
  };

  let addDropdownList = [
    {
      label: "Edit Fields",
      onClick: currentModuleCustomView?.systemDefined
        ? () => {}
        : () =>
            handleCustomViewFieldChange(currentModuleCustomView as ICustomView),
      icon: (
        <FieldsIcon size={14} className={`mr-2 text-vryno-dropdown-icon`} />
      ),
      labelClasses: "text-vryno-dropdown-icon",
      visible: currentModuleCustomView?.systemDefined ? false : true,
    },
    {
      icon: <ImportIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Import ${dashboardName}`,
      onClick: () => {
        router.push(`${appName}/${modelName}/bulkimport`);
      },
      visible: true,
      labelClasses: "text-vryno-dropdown-icon",
    },
  ];
  addDropdownList = [
    ...addDropdownList,
    {
      icon: (
        <MassEmailIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
      ),
      label: `Mass Email`,
      onClick: () => {
        router.push(`${appName}/${modelName}/emailview`);
      },
      visible: true,
      labelClasses: "text-vryno-dropdown-icon",
    },
    massUpdateObject,
  ];

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between`}
    >
      <GenericDashboardHeaderContent
        customViewsSideBarVisible={customViewsSideBarVisible}
        disableSearchButton={disableSearchButton}
        modelData={modelData}
        selectedItems={selectedItems}
        loading={loading}
        itemsCount={itemsCount}
        appName={appName}
        modelName={modelName}
        fieldsList={fieldsList}
        currentDashboardView={currentDashboardView}
        KVRecordData={KVRecordData}
        newDataFoundWithSideNavFilters={newDataFoundWithSideNavFilters}
        customViews={customViews}
        currentCustomView={currentCustomView}
        defaultCustomViewId={defaultCustomViewId}
        userPreferences={userPreferences}
        setZIndex={setZIndex}
        setEmailTemplateModal={setEmailTemplateModal}
        deleteSelectedItems={deleteSelectedItems}
        handleSelectAllItems={handleSelectAllItems}
        handleUnselectAllItems={handleUnselectAllItems}
        setCustomViewsSideBarVisible={setCustomViewsSideBarVisible}
        setLocalSearchModal={setLocalSearchModal}
        setExportPdfModal={(value) => setExportPdfModal(value)}
        handleCustomViewSelection={handleCustomViewSelection}
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
      <div className="w-full flex items-center justify-between sm:justify-end gap-x-4 mb-1">
        <div>
          <Button
            id={`add-${modelName}`}
            onClick={() => {
              router
                .push(
                  appsUrlGenerator(
                    appName,
                    modelName,
                    AllowedViews.add,
                    undefined,
                    modelNameValuesWithSystemSubForm.includes(modelName)
                      ? [
                          `?subform=${
                            modelNameMapperForParamURLGenerator(modelName)
                              ?.subForm
                          }&&dependingModule=product`,
                        ]
                      : []
                  )
                )
                .then();
            }}
            kind="primary"
            disabled={loading}
            userEventName={`open-add-${modelName}-page-click`}
          >
            <span
              className={`px-4 sm:px-6 col-span-2 sm:col-span-8 flex justify-center items-center w-full h-full`}
            >
              <span className="flex">
                <CircleIcon size={20} className="mr-1" />
                {dashboardName}
              </span>
            </span>
          </Button>
        </div>
        <div className="flex gap-x-4 items-center justify-end">
          {loading
            ? ViewButtonLoader()
            : DashboardViewSelector(
                currentDashboardView,
                setCurrentDashbaordView,
                modelName,
                fieldsList.filter((field) => field.dataType === "lookup"),
                fieldsList.filter(
                  (field) =>
                    ["amount", "expectedRevenue"].includes(field.name) &&
                    (field.visible || KVData?.aggregateBy === field.name)
                ),
                fieldsList.filter((field) => field.name === "currency")?.[0] ||
                  [],
                fieldsList,
                KVData,
                setKVData,
                sortingFieldList,
                KViewDataLoading
              )}
          <ButtonWithDropdown
            id={`${modelName}-more-options`}
            kind="white"
            launchMenuArray={addDropdownList}
            dropdownDownIcon={
              <MoreDataIcon className="text-vryno-theme-blue-secondary" />
            }
            dropdownUpIcon={
              <MoreDataIcon className="text-vryno-theme-blue-secondary" />
            }
          />
        </div>
      </div>
    </div>
  );
};
export default GenericDashboardHeader;
