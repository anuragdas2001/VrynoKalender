import React, { useRef } from "react";
import { ClickOutsideToClose } from "../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import MoreDataIcon from "remixicon-react/More2FillIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import EditIcon from "remixicon-react/EditBoxLineIcon";
import DefaultIcon from "remixicon-react/StarLineIcon";
import DefaultIcon2 from "remixicon-react/StarFillIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import { useRouter } from "next/router";
import { User } from "../../../../../models/Accounts";

export const DashboardSidePageNavigationItem = ({
  index,
  appName,
  modelName,
  dashboard,
  defaultDashboard,
  currentPageNavigation,
  setCurrentPageNavigation,
  handleDashboardSelection,
  handlePreferencesChange,
  setDeleteModal,
  user,
  isCollapsed,
}: {
  index: number;
  appName: string;
  modelName: string;
  dashboard: IDashboardDetails;
  defaultDashboard?: string;
  currentPageNavigation: IDashboardDetails | undefined;
  setCurrentPageNavigation: (item: IDashboardDetails) => void;
  handleDashboardSelection: (item: IDashboardDetails) => void;
  handlePreferencesChange: (item: IDashboardDetails, value: boolean) => void;
  setDeleteModal: (value: {
    visible: boolean;
    item: IDashboardDetails;
  }) => void;
  user: User | null;
  isCollapsed: boolean;
}) => {
  const router = useRouter();
  const [actionMenuDashboardVisible, setActionMenuDashboardVisible] =
    React.useState<boolean>(false);
  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value) =>
    setActionMenuDashboardVisible(value)
  );

  return (
    <div
      className={`w-full grid grid-cols-7 gap-x-1 my-1.5 hover:bg-gray-100 items-center ${
        currentPageNavigation === dashboard
          ? "bg-gray-100 text-vryno-theme-light-blue border-l-4 border-vryno-theme-light-blue"
          : ""
      }`}
    >
      {dashboard?.id === defaultDashboard ? (
        <Button
          id={`handle-${dashboard?.name}-user-preference-true`}
          customStyle={`pl-2 ${
            dashboard?.id
              ? "cursor-pointer text-vryno-theme-light-blue"
              : "opacity-50"
          }`}
          onClick={() =>
            dashboard?.id && handlePreferencesChange(dashboard, false)
          }
          userEventName="dashboard-toggle-user-preference-true-click"
          renderChildrenOnly={true}
        >
          <DefaultIcon2 size={16} />
        </Button>
      ) : (
        <Button
          id={`handle-${dashboard?.name}-user-preference-false`}
          customStyle="pl-2 cursor-pointer"
          onClick={() => handlePreferencesChange(dashboard, true)}
          userEventName="dashboard-toggle-user-preference-false-click"
          renderChildrenOnly={true}
        >
          {/* <DefaultIcon size={16} /> */}
          {dashboard?.icon}
        </Button>
      )}
      <a
        className="col-span-5 text-sm block break-all truncate px-2 py-2.5"
        href={dashboard.url}
        onClick={() => {
          setCurrentPageNavigation(dashboard);
          handleDashboardSelection(dashboard);
        }}
        key={index}
      >
        {!isCollapsed ? (
          <span className="text-xs ">{dashboard?.name}</span>
        ) : (
          ""
        )}
      </a>

      <div
        ref={wrapperRef}
        className="relative inline-block w-full h-full py-2 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* <Button
          id="dashboard-action-menu-icon"
          customStyle={`w-full h-full flex justify-center items-center ${
            dashboard?.id ? "" : "opacity-50"
          }`}
          onClick={() =>
            setActionMenuDashboardVisible(!actionMenuDashboardVisible)
          }
          userEventName="open-dashboard-action-menu-click"
        >
          <MoreDataIcon />
        </Button> */}
        {actionMenuDashboardVisible && (
          <div
            className="origin-top-right absolute right-0 z-[1000] mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            {[
              {
                label: "Edit",
                onClick:
                  dashboard?.id && user?.id === dashboard?.createdBy
                    ? () =>
                        router.push(
                          `${appName}/${modelName}/edit-dashboard/${dashboard.id}`
                        )
                    : undefined,
                icon: (
                  <EditIcon
                    size={14}
                    className={`${
                      !dashboard?.id || user?.id !== dashboard?.createdBy
                        ? "opacity-50"
                        : ""
                    }`}
                  />
                ),
              },
              {
                label: "Delete",
                onClick:
                  dashboard?.id && user?.id === dashboard?.createdBy
                    ? () => setDeleteModal({ visible: true, item: dashboard })
                    : undefined,
                icon: (
                  <DeleteBinIcon
                    size={14}
                    className={`${
                      !dashboard?.id || user?.id !== dashboard?.createdBy
                        ? "opacity-50"
                        : ""
                    }`}
                  />
                ),
              },
            ].map((menuItem, index) => (
              <div
                key={index}
                className="w-24 p-2 flex items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover gap-x-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  menuItem.onClick?.();
                }}
              >
                {menuItem.icon}
                <span
                  className={`truncate text-gray-600 text-sm ${
                    !dashboard?.id || user?.id !== dashboard?.createdBy
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  {menuItem.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
