import React from "react";
import {
  AddEditViewType,
  IGenericConversionFormData,
  SupportedApps,
} from "../../../../../models/shared";
import { IDeleteModalState } from "../../generic/GenericModelView/exportGenericModelDashboardTypes";
import { ActionWrapper } from "./ActionWrapper";
import { FullActionsMenu } from "../../generic/GenericModelView/FullActionsMenu";

export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}

export interface IGenericFormDetails {
  type: AddEditViewType | null;
  parentId: string;
  parentModelName: string;
  aliasName: string;
  id: string | null;
  modelName: string;
  appName: string;
}

export const GenericListActionMenu = ({
  appName,
  modelName,
  currentModuleLabel,
  navActivityModuleLabels,
  index,
  data,
  openingRecordId,
  recordId,
  zIndexValue,
  setFormModal,
  setDeleteModal,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  setDisplayConversionModal,
}: {
  appName: SupportedApps;
  modelName: string;
  currentModuleLabel: string;
  navActivityModuleLabels: {
    task: string | null;
    meeting: string | null;
    callLog: string | null;
  };
  zIndexValue?: number | undefined;
  index: number;
  stickyHeader?: boolean;
  recordId?: string;
  openingRecordId?: string | null;
  data: any[];
  setDeleteModal: (deleteModal: IDeleteModalState) => void;
  setFormModal: (modal: IFormModalObject) => void;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
}) => {
  const [isDropdownUpward, setIsDropdownUpward] = React.useState<{
    id: string;
    visible: boolean;
  }>({ id: "", visible: false });
  return (
    <ActionWrapper
      index={index}
      key={recordId}
      openingRecordId={openingRecordId}
      recordId={recordId}
      content={
        <FullActionsMenu
          data={
            data.filter((val) => val.id === recordId)?.length > 0
              ? data.filter((val) => val.id === recordId)[0]
              : {}
          }
          appName={appName}
          modelName={modelName}
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
          setFormModal={setFormModal}
          setDeleteModal={setDeleteModal}
          currentModuleLabel={currentModuleLabel}
          navActivityModuleLabels={navActivityModuleLabels}
          salesOrderModuleLabel={salesOrderModuleLabel}
          invoiceModuleLabel={invoiceModuleLabel}
          setDisplayConversionModal={setDisplayConversionModal}
        />
      }
      zIndexValue={isDropdownUpward.id === recordId ? zIndexValue : 1}
    />
  );
};
