import React from "react";
import { settingsUrlGenerator } from "../../../crm/shared/utils/settingsUrlGenerator";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import { SettingsSideBar } from "../../SettingsSidebar";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import Switch from "react-switch";
import Link from "next/link";
import {
  BaseGenericObjectType,
  IRole,
  SupportedApps,
} from "../../../../../models/shared";
import { useRouter } from "next/router";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { IUser, User } from "../../../../../models/Accounts";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import { PaginationFilterComponent } from "../../../../Shared/PaginationFilterCombined";
import _ from "lodash";
import { UserListActionWrapper } from "./UserListActionWrapper";
import { getFullUserName } from "../../../../Shared/getFullUserName";

export const UserList = ({
  userList,
  menuItem,
  rolesList,
  handleServerToggle,
  getEditMenuOptions,
  heightRef,
  onPageChange,
  itemsCount,
  currentPageNumber,
}: {
  userList: IUser[];
  menuItem: string;
  rolesList: IRole[];
  handleServerToggle: (record: BaseGenericObjectType) => void;
  getEditMenuOptions: (
    record: IUser,
    user: User | null
  ) => {
    icon: JSX.Element;
    label: string;
    onClick: (data: IUser) => void;
  }[];
  heightRef: React.RefObject<HTMLDivElement>;
  onPageChange: (pageNumber: number) => void;
  itemsCount: number;
  currentPageNumber: number;
}) => {
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;

  const router = useRouter();
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const [filterValue, setFilterValue] = React.useState<string>("");

  const UserTableHeader = [
    {
      columnName: "firstName",
      label: "Full Name",
      dataType: SupportedDataTypes.singleline,
      render: (record: BaseGenericObjectType, index: number) => {
        const findIndex = userList?.findIndex(
          (user) => user.email === record.email
        );
        if (userList.length) {
          return (
            <Link href="" legacyBehavior>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    settingsUrlGenerator(SupportedApps.crm, menuItem, "", [
                      "edit",
                      record.id,
                    ])
                  );
                }}
              >
                <p>{getFullUserName(userList[findIndex])}</p>
              </a>
            </Link>
          );
        }
      },
    },
    {
      columnName: "email",
      label: "Email",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "roleId",
      label: "Role",
      dataType: SupportedDataTypes.uuid,
      render: (record: IUser, index: number) => {
        return (
          <div className="flex flex-wrap">
            {rolesList.length &&
              rolesList.map((role) => {
                if (record.roleId.includes(role.id)) {
                  return (
                    <Button
                      key={role.id}
                      id={`role-${role?.role || role?.id}-${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          settingsUrlGenerator(
                            SupportedApps.crm,
                            "role-permission",
                            role.key,
                            ["permissions", "crm", role.role]
                          )
                        );
                      }}
                      customStyle={`px-3 mb-3 bg-gray-200 text-gray-800 rounded-full inline-block mr-2 ${
                        role?.key === "instance-owner"
                          ? ""
                          : "hover:bg-gray-300"
                      }`}
                      customFontSize="text-xs"
                      userEventName="open-permissions-via-user-list-page"
                      disabled={role?.key === "instance-owner" ? true : false}
                    >
                      {role.role}
                    </Button>
                  );
                }
              })}
          </div>
        );
      },
    },
    {
      columnName: "status",
      label: "Active",
      dataType: SupportedDataTypes.uuid,
      render: (record: BaseGenericObjectType) => {
        return (
          <Switch
            id={"switch-button"}
            name={"user-switch"}
            value={record.isActive}
            checked={record.isActive}
            onChange={() => handleServerToggle(record)}
            onColor="#4DBE8D"
            offColor="#DBDBDB"
          />
        );
      },
    },
    {
      columnName: "actions",
      label: "Actions",
      dataType: SupportedDataTypes.singleline,
      render: (record: IUser, index: number) => {
        let disabled = true;
        if (!(user?.id === record.id)) {
          rolesList.forEach((role) => {
            if (role.key !== "instance-owner") {
              disabled = false;
            }
          });
        }
        const findIndex = userList?.findIndex(
          (user) => user.email === record.email
        );
        return (
          <UserListActionWrapper
            index={index}
            record={record}
            recordId={record?.id}
            zIndexValue={userList.length - index}
            findIndex={findIndex}
            menuItem={menuItem}
            user={user}
            userList={userList}
            getEditMenuOptions={getEditMenuOptions}
          />
        );
      },
    },
  ];

  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 20);
    }
  }, [userList]);

  return (
    <>
      <GenericBackHeader heading="Users" addButtonInFlexCol={true}>
        <div>
          <Button
            id="add-user"
            buttonType="thin"
            kind="primary"
            onClick={() =>
              router.push(
                settingsUrlGenerator(SupportedApps.crm, menuItem, "", ["add"])
              )
            }
            userEventName="open-add-user-page-click"
          >
            <div className="flex gap-x-1">
              <CircleIcon size={20} />
              Add User
            </div>
          </Button>
        </div>
      </GenericBackHeader>
      <div className="sm:hidden w-40 mt-4 mb-5">
        <SideDrawer
          sideMenuClass={sideMenuClass}
          setSideMenuClass={setSideMeuClass}
          buttonType={"thin"}
        >
          <SettingsSideBar />
        </SideDrawer>
      </div>
      <div className="px-6 sm:pt-6 h-full">
        {userList.length ? (
          <div className="mb-4">
            <PaginationFilterComponent
              filterName={"users"}
              currentPageItemCount={userList.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`hidden sm:flex sm:justify-between`}
            />
            <PaginationFilterComponent
              filterName={"users"}
              currentPageItemCount={userList.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`sm:hidden flex flex-col`}
            />
          </div>
        ) : (
          <></>
        )}
        <div
          className="pt-4 px-4 bg-white rounded-xl w-full h-full"
          ref={heightRef}
        >
          <GenericList
            tableHeaders={UserTableHeader}
            listSelector={false}
            data={userList}
            rowUrlGenerator={(record: IRole) => {
              return settingsUrlGenerator(SupportedApps.crm, menuItem, "", [
                "edit",
                record.id,
              ]);
            }}
            filterValue={filterValue}
          />
        </div>
      </div>
    </>
  );
};
