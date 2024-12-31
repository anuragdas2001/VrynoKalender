import React from "react";
import _ from "lodash";
import {
  AddEditViewType,
  SupportedApps,
} from "../../../../../../../models/shared";
import { ActionWrapper } from "../../../../../crm/shared/components/ActionWrapper";
import { EditDropdown } from "../../../../../../../components/TailwindControls/Form/EditDropdown/EditDropdown";
import { useRouter } from "next/router";
import { settingsUrlGenerator } from "../../../../../crm/shared/utils/settingsUrlGenerator";
import { SettingsMenuItem } from "../../../../../../../models/Settings";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import { IFieldsDependencyMappingCollection } from "./FieldsDependency";

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

export const FieldsDependencyListActionWrapper = ({
  index,
  record,
  recordId,
  zIndexValue,
  moduleName,
  setDeleteModal,
}: {
  zIndexValue?: number | undefined;
  index: number;
  record: any;
  recordId?: string;
  openingRecordId?: string | null;
  moduleName: string;
  setDeleteModal: (
    value: React.SetStateAction<{
      visible: boolean;
      id: string;
    }>
  ) => void;
}) => {
  const [isDropdownUpward, setIsDropdownUpward] = React.useState<{
    id: string;
    visible: boolean;
  }>({ id: "", visible: false });

  const router = useRouter();

  return (
    <ActionWrapper
      index={index}
      zIndexValue={isDropdownUpward.id === recordId ? zIndexValue : 1}
      content={
        <EditDropdown
          editAction={(data: IFieldsDependencyMappingCollection) => {
            router.push(
              settingsUrlGenerator(
                SupportedApps.crm,
                SettingsMenuItem.moduleFields,
                moduleName,
                ["create-dependency", data.id]
              )
            );
          }}
          editMenuArray={[
            {
              icon: (
                <DeleteBinIcon
                  size={16}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: "Delete",
              onClick: (data: IFieldsDependencyMappingCollection) => {
                setDeleteModal({
                  visible: true,
                  id: data.id,
                });
              },
            },
          ]}
          data={record}
          dataTestIdValue={_.get(record, "parentFieldName", "")}
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
        />
      }
    />
  );
};
