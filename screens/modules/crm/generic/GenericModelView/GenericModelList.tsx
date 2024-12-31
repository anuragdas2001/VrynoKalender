import React from "react";
import GenericList, {
  GenericListHeaderType,
} from "../../../../../components/TailwindControls/Lists/GenericList";
import { IDeleteModalState } from "./exportGenericModelDashboardTypes";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import {
  AddEditViewType,
  IGenericConversionFormData,
  SupportedApps,
} from "../../../../../models/shared";
import { AllowedViews } from "../../../../../models/allowedViews";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../models/ICustomField";
import _ from "lodash";
import { GenericListActionMenu } from "../../shared/components/GenericListActionWrapper";

export interface IGenericFormDetails {
  type: AddEditViewType | null;
  parentId: string;
  parentModelName: string;
  aliasName: string;
  id: string | null;
  modelName: string;
  appName: string;
}

export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}

export type GenericModelListType = {
  tableHeaders: Array<GenericListHeaderType>;
  appName: SupportedApps;
  modelName: string;
  data: Record<string, string>[];
  launchUrl?: string;
  launchMenuArray?: Array<{
    icon: object;
    label: string;
    onClick: () => void;
    labelClasses?: string;
  }>;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[];
  setDeleteModal: (deleteModal: IDeleteModalState) => void;
  setFormModal: (modal: IFormModalObject) => void;
  selectedItems: Array<any>;
  onItemSelect: (selectedItem: any) => void;
  fieldsList: ICustomField[];
  setSelectItemsOnAllPages?: () => void;
  listSelector?: boolean;
  currentModuleLabel: string;
  navActivityModuleLabels: {
    task: string | null;
    meeting: string | null;
    callLog: string | null;
  };
  handleSorting?: (value: {
    name: string;
    order: "ASC" | "DESC" | "None";
  }) => void;
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
  updateModelFieldData: (field: string, value: any, id: string) => void;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
};

export default function GenericModelList({
  tableHeaders,
  data,
  setDeleteModal,
  setFormModal,
  appName,
  modelName,
  selectedItems,
  sortingFieldList,
  onItemSelect,
  fieldsList,
  listSelector,
  dataProcessed,
  dataProcessing,
  setSelectItemsOnAllPages = () => {},
  currentModuleLabel,
  navActivityModuleLabels,
  handleSorting = () => {},
  openingRecordId,
  setOpeningRecordId,
  updateModelFieldData,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  setDisplayConversionModal,
}: GenericModelListType) {
  return (
    <GenericList
      data={data}
      rowUrlGenerator={(item) =>
        appsUrlGenerator(
          appName,
          modelName,
          AllowedViews.detail,
          item.id as string
        )
      }
      dataProcessed={dataProcessed}
      dataProcessing={dataProcessing}
      includeFlagInPhoneNumber={true}
      openingRecordId={openingRecordId}
      setOpeningRecordId={setOpeningRecordId}
      richTextOverflowScroll={false}
      tableHeaders={[
        ...tableHeaders,
        {
          columnName: "actions",
          label: "Actions",
          dataType: SupportedDataTypes.singleline,
          render: (record: any, index: number) => {
            return (
              <GenericListActionMenu
                index={index}
                key={record.id}
                data={data}
                openingRecordId={openingRecordId}
                recordId={record?.id}
                appName={appName}
                modelName={modelName}
                currentModuleLabel={currentModuleLabel}
                navActivityModuleLabels={navActivityModuleLabels}
                setDeleteModal={setDeleteModal}
                setFormModal={setFormModal}
                zIndexValue={data.length - index}
                salesOrderModuleLabel={salesOrderModuleLabel}
                invoiceModuleLabel={invoiceModuleLabel}
                setDisplayConversionModal={setDisplayConversionModal}
              />
            );
          },
        },
      ]}
      fieldsList={fieldsList}
      addSorting={true}
      sortingFieldList={sortingFieldList}
      selectedItems={selectedItems}
      onItemSelect={(value) => onItemSelect(value)}
      setSelectItemsOnAllPages={setSelectItemsOnAllPages}
      onDetail={false}
      showIcons={false}
      listSelector={listSelector}
      truncate={true}
      handleSorting={handleSorting}
      checkForMassDelete={{
        check: true,
        sessionStorageKeyName: "bulkDeleteData",
      }}
      showFieldEditInput={false}
      appName={appName}
      updateModelFieldData={updateModelFieldData}
    />
  );
}
