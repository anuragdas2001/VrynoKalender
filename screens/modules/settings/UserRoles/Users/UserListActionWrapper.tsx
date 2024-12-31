import React from "react";
import _ from "lodash";
import { AddEditViewType, SupportedApps } from "../../../../../models/shared";
import { ActionWrapper } from "../../../crm/shared/components/ActionWrapper";
import { EditDropdown } from "../../../../../components/TailwindControls/Form/EditDropdown/EditDropdown";
import { settingsUrlGenerator } from "../../../crm/shared/utils/settingsUrlGenerator";
import { IUser, User } from "../../../../../models/Accounts";
import { getFullUserName } from "../../../../Shared/getFullUserName";

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

export const UserListActionWrapper = ({
  index,
  record,
  recordId,
  zIndexValue,
  menuItem,
  user,
  userList,
  findIndex,
  getEditMenuOptions,
}: {
  zIndexValue?: number | undefined;
  index: number;
  record: IUser;
  recordId?: string;
  openingRecordId?: string | null;
  menuItem: string;
  user: User | null;
  userList: IUser[];
  findIndex: number;
  getEditMenuOptions: (
    record: IUser,
    user: User | null
  ) => {
    icon: JSX.Element;
    label: string;
    onClick: (data: IUser) => void;
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
          editAction={settingsUrlGenerator(SupportedApps.crm, menuItem, "", [
            "edit",
            record.id,
          ])}
          actionIsLink={true}
          editMenuArray={[
            ...getEditMenuOptions(record, user).map((item) => {
              return {
                ...item,
                dataTestId: `${item.label}-${getFullUserName(
                  userList[findIndex]
                )}`,
              };
            }),
          ]}
          data={record}
          dataTestIdValue={getFullUserName(userList[findIndex])}
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
        />
      }
    />
  );
};
