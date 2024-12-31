import React from "react";
import _ from "lodash";
import { AddEditViewType } from "../../../../../models/shared";
import { ActionWrapper } from "../../../crm/shared/components/ActionWrapper";
import { EditDropdown } from "../../../../../components/TailwindControls/Form/EditDropdown/EditDropdown";

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

export const RolesListActionWrapper = ({
  index,
  record,
  recordId,
  zIndexValue,
  editAction,
  editMenuArray,
}: {
  zIndexValue?: number | undefined;
  index: number;
  record: any;
  recordId?: string;
  openingRecordId?: string | null;
  editAction: (data: any) => void;
  editMenuArray: {
    icon: React.JSX.Element;
    label: string;
    onClick?: ((id: string | Record<string, string> | any) => void) | undefined;
    rowUrlGenerator?:
      | ((id: string | Record<string, string> | any) => string)
      | undefined;
    labelClasses?: string | undefined;
    visible?: boolean | undefined;
  }[];
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
          editAction={editAction}
          editMenuArray={[
            ...editMenuArray.map((item) => {
              return {
                ...item,
                dataTestId: `${item.label}-${_.get(record, "role", "")}`,
              };
            }),
          ]}
          data={record}
          dataTestIdValue={_.get(record, "role", "")}
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
        />
      }
    />
  );
};
