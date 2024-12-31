import React, { useRef } from "react";
import { ClickOutsideToClose } from "../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import { ICustomView } from "../../../../../models/shared";
import MoreDataIcon from "remixicon-react/More2FillIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import EditIcon from "remixicon-react/EditBoxLineIcon";
import DefaultIcon from "remixicon-react/StarLineIcon";
import DefaultIcon2 from "remixicon-react/StarFillIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { paramCase } from "change-case";
import { User } from "../../../../../models/Accounts";

export const CustomViewSideBarMenuItem = ({
  index,
  currentCustomView,
  customView,
  defaultCustomViewId,
  datatestid,
  handleUserPreference,
  handleCustomViewSelection,
  setCurrentCustomviewSelected,
  handleEditCustomView,
  handleDeleteCustomView,
  user,
}: {
  index: number;
  currentCustomView?: ICustomView;
  customView: ICustomView;
  defaultCustomViewId?: string;
  datatestid?: string;
  handleUserPreference: (
    status: boolean,
    customViewId: string,
    customView: ICustomView
  ) => void;
  handleCustomViewSelection: (customView: ICustomView) => void;
  setCurrentCustomviewSelected: (customView: ICustomView) => void;
  handleEditCustomView: (customView: ICustomView) => void;
  handleDeleteCustomView: (customView: ICustomView) => void;
  user: User | null;
}) => {
  const [actionMenuCustomViewVisible, setActionMenuCustomViewVisible] =
    React.useState<boolean>(false);

  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value) =>
    setActionMenuCustomViewVisible(value)
  );

  return (
    <div
      className={`w-full grid grid-cols-7 my-1.5 hover:bg-gray-100 items-center ${
        currentCustomView === customView
          ? "text-vryno-theme-light-blue"
          : "text-black"
      } border-b border-gray-200`}
      data-testid={paramCase(datatestid ?? "")}
    >
      {customView?.id === defaultCustomViewId ? (
        <Button
          id={`custom-view-${customView.name}-set-default-true`}
          customStyle={`pl-2 cursor-pointer text-vryno-theme-light-blue`}
          onClick={() =>
            handleUserPreference(false, customView?.id, customView)
          }
          userEventName="customView-toggle-user-preference-false-click"
          renderChildrenOnly={true}
        >
          <DefaultIcon2 size={14} />
        </Button>
      ) : (
        <Button
          id={`custom-view-${customView.name}-set-default-false`}
          customStyle="pl-2 cursor-pointer"
          onClick={() => handleUserPreference(true, customView?.id, customView)}
          userEventName="customView-toggle-user-preference-true-click"
          renderChildrenOnly={true}
        >
          <DefaultIcon size={14} />
        </Button>
      )}
      <a
        className={`col-span-5 text-sm text-left block break-all truncate px-2 py-2.5`}
        href={`#${customView.name}`}
        data-testid={paramCase(customView.name)}
        onClick={(e) => {
          handleCustomViewSelection(customView);
          setCurrentCustomviewSelected(customView);
        }}
        key={index}
        title={customView.name}
      >
        <span style={{ fontSize: "12px", lineHeight: "18px" }}>
          {customView.name}
        </span>
      </a>

      <button
        ref={wrapperRef}
        className={`relative inline-block cursor-pointer w-full h-full py-2`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <>
          <Button
            id="custom-view-action-menu-icon"
            customStyle="w-full h-full flex flex-row justify-center items-center"
            onClick={() =>
              setActionMenuCustomViewVisible(!actionMenuCustomViewVisible)
            }
            userEventName="open-customView-action-menu-click"
          >
            <MoreDataIcon size={18} />
          </Button>
          {actionMenuCustomViewVisible && (
            <div
              className={`origin-top-right absolute right-2 z-[1000] mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {[
                {
                  label: "Edit",
                  onClick:
                    customView?.systemDefined ||
                    user?.id !== customView?.createdBy
                      ? () => {}
                      : () => handleEditCustomView(customView),
                  icon: (
                    <EditIcon
                      size={14}
                      className={`${
                        customView?.systemDefined ||
                        user?.id !== customView?.createdBy
                          ? "opacity-50"
                          : ""
                      }`}
                    />
                  ),
                },
                {
                  label: "Delete",
                  onClick:
                    customView?.systemDefined ||
                    user?.id !== customView?.createdBy
                      ? () => {}
                      : () => handleDeleteCustomView(customView),
                  icon: (
                    <DeleteBinIcon
                      size={14}
                      className={`${
                        customView?.systemDefined ||
                        user?.id !== customView?.createdBy
                          ? "opacity-50"
                          : ""
                      }`}
                    />
                  ),
                },
              ]?.map((menuItem, index) => {
                return (
                  <div key={index}>
                    <div
                      id={`menu-${menuItem.label}`}
                      data-testid={paramCase(menuItem.label)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        menuItem.onClick();
                      }}
                      className={`w-24 p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover gap-x-2`}
                    >
                      {menuItem.icon}
                      <span
                        className={`truncate text-gray-600 text-sm ${
                          customView?.systemDefined ||
                          user?.id !== customView?.createdBy
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        {menuItem.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      </button>
    </div>
  );
};
