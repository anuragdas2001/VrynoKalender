import React from "react";
import { AddEditViewType, IRole } from "../../../../../../models/shared";
import { ActionWrapper } from "../../../../crm/shared/components/ActionWrapper";
import { EditDropdown } from "../../../../../../components/TailwindControls/Form/EditDropdown/EditDropdown";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import _ from "lodash";

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

export const ModuleListActionWrapper = ({
  index,
  record,
  recordId,
  zIndexValue,
  dropdownArray,
  setModuleFormModal,
}: {
  zIndexValue?: number | undefined;
  index: number;
  record: any;
  recordId?: string;
  openingRecordId?: string | null;
  dropdownArray: (
    | {
        icon: React.JSX.Element;
        label: string;
        rowUrlGenerator: (data: IRole) => string;
      }
    | {
        icon: React.JSX.Element;
        label: string;
        onClick: () => void;
      }
  )[];
  setModuleFormModal: (
    value: React.SetStateAction<{
      visible: boolean;
      data: IModuleMetadata | null;
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
      content={
        <EditDropdown
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
          editAction={() => setModuleFormModal({ visible: true, data: record })}
          actionIsLink={true}
          editMenuArray={dropdownArray}
          data={record}
          optionsWidth={"w-48"}
          dataTestIdValue={_.get(record.label, "en", "")}
        />
      }
      zIndexValue={isDropdownUpward.id === recordId ? zIndexValue : 1}
    />
  );
};
