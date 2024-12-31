import React from "react";
import _ from "lodash";
import { AddEditViewType } from "../../../../../../models/shared";
import { ActionWrapper } from "../../../../crm/shared/components/ActionWrapper";
import { EditDropdown } from "../../../../../../components/TailwindControls/Form/EditDropdown/EditDropdown";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { ICustomField } from "../../../../../../models/ICustomField";

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

export const CustomizationFieldsListActionWrapper = ({
  index,
  record,
  recordId,
  zIndexValue,
  tableDataProcessing,
  onEditCustomField,
  setEditFieldPermission,
}: {
  zIndexValue?: number | undefined;
  index: number;
  record: any;
  recordId?: string;
  openingRecordId?: string | null;
  tableDataProcessing: boolean;
  onEditCustomField: (item: ICustomField) => void;
  setEditFieldPermission: (
    value: React.SetStateAction<{
      visible: boolean;
      data: ICustomField | null;
    }>
  ) => void;
}) => {
  const [isDropdownUpward, setIsDropdownUpward] = React.useState<{
    id: string;
    visible: boolean;
  }>({ id: "", visible: false });

  return (
    <ActionWrapper
      index={index}
      zIndexValue={isDropdownUpward.id === recordId ? zIndexValue : 1}
      content={
        <EditDropdown
          editAction={
            tableDataProcessing ? () => {} : () => onEditCustomField(record)
          }
          editMenuArray={[
            {
              label: "Edit Permissions",
              onClick: (data: any) => {
                if (data.mandatory) {
                  Toast.error("Cannot set field permission on mandatory field");
                  return;
                }
                setEditFieldPermission({ visible: true, data: record });
              },
            },
          ]}
          data={record}
          dataTestIdValue={_.get(record?.label, "en", "")}
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
        />
      }
    />
  );
};
