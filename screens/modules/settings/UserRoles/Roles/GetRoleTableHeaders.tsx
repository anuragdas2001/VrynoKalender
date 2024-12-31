import Link from "next/link";
import React from "react";
import { EditDropdown } from "../../../../../components/TailwindControls/Form/EditDropdown/EditDropdown";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { IRole, SupportedApps } from "../../../../../models/shared";
import { Config } from "../../../../../shared/constants";
import { ActionWrapper } from "../../../crm/shared/components/ActionWrapper";
import { settingsUrlGenerator } from "../../../crm/shared/utils/settingsUrlGenerator";
import { UserName } from "../Users/UserName";
import _ from "lodash";
import { RolesListActionWrapper } from "./RolesListActionWrapper";

const renderLink = (url: string, content: {} | string) => {
  return (
    <Link href={url} passHref legacyBehavior>
      <span>
        <>{content}</>
      </span>
    </Link>
  );
};

export const GetRoleTableHeaders = (
  menuItem: string,
  editMenuArray: Array<{
    icon: React.JSX.Element;
    label: string;
    onClick?: (id: IRole) => void;
    rowUrlGenerator?: (id: IRole) => string;
    labelClasses?: string;
    visible?: boolean;
  }>,
  editAction: (data: IRole) => void,
  count: number,
  userRoles: IRole[]
) => [
  {
    columnName: "role",
    label: "Role Name",
    dataType: SupportedDataTypes.singleline,
  },
  {
    columnName: "key",
    label: "Key",
    dataType: SupportedDataTypes.singleline,
  },
  {
    columnName: "createdBy",
    label: "created By",
    dataType: SupportedDataTypes.singleline,
    render: (record: IRole, index: number) => {
      if (!record.createdBy) {
        return <></>;
      }
      if (record.createdBy === Config.systemAdminUserId) {
        return (
          <div className="text-gray-500 dark:text-gray-400">
            {renderLink(
              settingsUrlGenerator(SupportedApps.crm, menuItem, record.key, [
                "permissions",
              ]),
              "System Admin"
            )}
          </div>
        );
      }
      return (
        <div className="text-gray-500 dark:text-gray-400">
          {renderLink(
            settingsUrlGenerator(SupportedApps.crm, menuItem, record.key, [
              "permissions",
            ]),
            <UserName id={record.createdBy} />
          )}
        </div>
      );
    },
  },
  {
    columnName: "updatedAt",
    label: "Modified At",
    dataType: SupportedDataTypes.datetime,
  },
  {
    columnName: "actions",
    label: "Actions",
    dataType: SupportedDataTypes.singleline,
    render: (record: IRole, index: number) => {
      return (
        <RolesListActionWrapper
          index={index}
          record={record}
          recordId={record?.id}
          zIndexValue={userRoles.length - index}
          editMenuArray={editMenuArray}
          editAction={editAction}
        />
      );
    },
  },
];
