import React from "react";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import Link from "next/link";
import { getAppPathParts } from "../../../../screens/modules/crm/shared/utils/getAppPathParts";
import { ClickOutsideToClose } from "../../shared/ClickOutsideToClose";
import Button from "../Button/Button";
import _ from "lodash";
import { paramCase } from "change-case";

export const EditDropdown = ({
  editAction,
  actionIsLink = false,
  editMenuArray,
  data,
  optionsWidth = "w-32",
  dataTestIdValue,
  isDropdownUpward,
  setIsDropdownUpward,
  disabled = false,
}: {
  editAction?: string | ((data: any) => void);
  actionIsLink?: boolean;
  editMenuArray?: Array<{
    icon?: React.JSX.Element;
    label: string;
    onClick?: (id: string | Record<string, string> | any) => void;
    rowUrlGenerator?: (id: string | Record<string, string> | any) => string;
    labelClasses?: string;
    visible?: boolean;
    dataTestId?: string;
  }>;
  isDropdownUpward: {
    id: string;
    visible: boolean;
  };
  data: any;
  optionsWidth?: string;
  dataTestIdValue: string;
  setIsDropdownUpward: React.Dispatch<
    React.SetStateAction<{
      id: string;
      visible: boolean;
    }>
  >;
  disabled?: boolean;
}) => {
  const [launchMenuVisible, setLaunchMenuVisible] = React.useState(false);
  const wrapperRef = React.useRef(null);
  const dropdownClass = `p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover ${optionsWidth}`;
  ClickOutsideToClose(wrapperRef, (value: boolean) => {
    setLaunchMenuVisible(value);
    setIsDropdownUpward({ id: "", visible: false });
  });

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (wrapperRef.current as any).getBoundingClientRect();
    const dropdownIsUpward = window.innerHeight - rect.bottom < 200;
    setIsDropdownUpward({ id: item.id, visible: dropdownIsUpward });
    setLaunchMenuVisible(!launchMenuVisible);
  };

  return (
    <div
      className={`w-full flex flex-row justify-start ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div
        className={`h-9 w-28 rounded-md p-1 grid border border-vryno-button-border ${
          editMenuArray?.length ? "grid-cols-10" : "grid-cols-8"
        }`}
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
        }}
      >
        {actionIsLink && typeof editAction === "string" && (
          <Link
            href={editAction && editAction}
            passHref
            legacyBehavior
            style={{ pointerEvents: disabled ? "none" : "auto" }}
          >
            <a
              id={`edit-${dataTestIdValue}`}
              data-testid={paramCase(`edit-${dataTestIdValue}`)}
              className={`col-span-8 flex flex-row items-center justify-center ${
                editMenuArray?.length
                  ? "border-r border-vryno-content-divider"
                  : ""
              }`}
            >
              <EditBoxIcon
                size={17}
                className="text-vryno-theme-light-blue mr-2"
              />
              <span className="text-xsm font-medium text-gray-500">Edit</span>
            </a>
          </Link>
        )}
        {typeof editAction !== "string" && (
          <Button
            id={`edit-${dataTestIdValue}`}
            onClick={(e) => {
              e.stopPropagation();
              if (disabled) return;
              editAction && editAction(data);
            }}
            customStyle="col-span-8 border-r border-vryno-content-divider flex flex-row items-center justify-center"
            userEventName="edit-dropdown-edit:action-click"
            renderChildrenOnly={true}
            disabled={disabled}
          >
            <>
              <EditBoxIcon
                size={17}
                className="text-vryno-theme-light-blue mr-2"
              />
              <span className="text-xsm font-medium text-gray-500">Edit</span>
            </>
          </Button>
        )}
        {editMenuArray?.length ? (
          <div
            ref={wrapperRef}
            className="col-span-2 relative inline-block text-left cursor-pointer"
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (disabled) return;
                handleButtonClick(e, data);
              }}
              id={`action-menu-button-${dataTestIdValue}`}
              customStyle="w-full h-full flex flex-row justify-center items-center"
              userEventName="edit-dropdown-open-edit-dropdown-menu-click"
              disabled={disabled}
            >
              {launchMenuVisible ? (
                <ChevronUpIcon size={15} className="text-gray-500" />
              ) : (
                <ChevronDownIcon size={15} className="text-gray-500" />
              )}
            </Button>
            {launchMenuVisible && editMenuArray && (
              <div
                className={`origin-top-right flex flex-col absolute z-40 -right-1 ${
                  isDropdownUpward.visible && isDropdownUpward.id === data["id"]
                    ? "-bottom-0"
                    : "top-10"
                } mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                style={{
                  marginTop:
                    isDropdownUpward.visible &&
                    isDropdownUpward.id === data["id"]
                      ? "0px"
                      : "2px",
                  marginBottom:
                    isDropdownUpward.visible &&
                    isDropdownUpward.id === data["id"]
                      ? "2.5rem"
                      : "",
                }}
              >
                {editMenuArray.map((menuItem, index) => {
                  if (menuItem.onClick) {
                    return (
                      <Button
                        customStyle={`${dropdownClass} ${
                          menuItem.labelClasses || ""
                        }`}
                        key={index}
                        id={
                          menuItem.dataTestId
                            ? `${menuItem.dataTestId}`
                            : `${menuItem.label}`
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          menuItem.onClick && menuItem.onClick(data);
                        }}
                        userEventName={`edit-dropdown-${menuItem.label}-click`}
                        renderChildrenOnly={true}
                      >
                        <div
                          className={`${menuItem.icon ? "flex w-full" : ""}`}
                        >
                          {menuItem.icon ? menuItem.icon : <></>}
                          <span className="text-black">{menuItem.label}</span>
                        </div>
                      </Button>
                    );
                  }
                  if (menuItem.rowUrlGenerator) {
                    return (
                      <Link
                        href={menuItem.rowUrlGenerator(data)}
                        passHref
                        key={index}
                        legacyBehavior
                      >
                        <a
                          className={`${dropdownClass} ${
                            menuItem.labelClasses || ""
                          }`}
                          id={`${menuItem.label}`}
                          data-testid={
                            menuItem.dataTestId
                              ? paramCase(`${menuItem.dataTestId}`)
                              : paramCase(`${menuItem.label}`)
                          }
                        >
                          {menuItem.icon ? menuItem.icon : <></>}
                          <span className="text-black">{menuItem.label}</span>
                        </a>
                      </Link>
                    );
                  }
                })}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
