import React, { useRef } from "react";
import { ClickOutsideToClose } from "../../shared/ClickOutsideToClose";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import Button from "./Button";

export type ButtonWithDropdownProps = {
  id: string;
  children?: React.ReactElement;
  dropdownUpIcon?: React.ReactElement;
  dropdownDownIcon?: React.ReactElement;
  dropdownIconData?: React.ReactElement;
  name?: string;
  type?: "button" | "submit" | "reset";
  setZIndex?: (value: boolean) => void;
  onClick?: () => void;
  handleSelectedOption?: (item: {
    icon?: object;
    label: string;
    onClick: () => void;
    labelClasses?: string;
    visible?: boolean;
  }) => void;
  kind?:
    | "primary"
    | "secondary"
    | "white"
    | "back"
    | "next"
    | "danger"
    | "icon";
  buttonType?: "thin" | "normal";
  disabled?: boolean;
  ref?: React.MutableRefObject<any>;
  launchMenuArray?: Array<{
    icon?: JSX.Element;
    label: string;
    onClick: () => void;
    labelClasses?: string;
    visible: boolean;
  }>;
  dataTestId?: string;
  externalLaunchMenu?: React.ReactElement;
  activeButton?: string;
  dropdownTop?: string;
  maxHeight?: string;
  alignDropdownMenu?: "right" | "left";
  width?: string;
};

export default function ButtonWithDropdown({
  type = "button",
  id,
  children,
  dropdownUpIcon,
  dropdownDownIcon,
  kind = "primary",
  buttonType = "normal",
  onClick = () => {},
  handleSelectedOption = () => {},
  setZIndex = () => {},
  disabled = false,
  launchMenuArray,
  activeButton,
  ref,
  dropdownTop = "top-9",
  dataTestId,
  externalLaunchMenu,
  dropdownIconData,
  maxHeight,
  alignDropdownMenu = "right",
  width = "w-44",
}: ButtonWithDropdownProps) {
  const [launchMenuVisible, setLaunchMenuVisible] = React.useState(false);
  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value) => {
    setLaunchMenuVisible(value);
    setZIndex(value);
  });

  const colorClassMap = {
    primary: "bg-vryno-theme-blue",
    icon: "bg-vryno-theme-light-blue",
    back: "bg-white",
    secondary: "bg-gray-400",
    next: "bg-vryno-theme-light-blue",
    danger: "bg-vryno-danger",
    white: "bg-white",
  };
  const finalColorClass = colorClassMap[kind];
  const overriddenBorderClasses: Record<string, string> = {
    back: "border border-vryno-theme-blue text-vryno-theme-blue",
    white: "border",
  };
  const finalTextClass = overriddenBorderClasses[kind] || "text-white";
  const borderRoundMap = {
    thin: "rounded-md",
    normal: "rounded-md",
    icon: "rounded-full",
  };
  const widthClassOverride: Record<string, string> = {
    icon: "w-fit",
    iconInverted: "w-fit",
  };

  const paddingClassMap = {
    thin: "py-2 px-6",
    normal: "py-2 px-2",
    icon: "py-1 px-1",
    iconInverted: "py-1 px-1",
    pointedDownBox: "py-2 px-6",
  };

  const [activeDropdown, setActiveDropdown] = React.useState("");
  if (activeButton) {
    setActiveDropdown(activeButton);
  }

  return (
    <Button
      id={id}
      disabled={disabled}
      customStyle={`text-sm grid grid-cols-3 sm:grid-cols-10 text-white rounded-md ${
        borderRoundMap[buttonType]
      } ${finalColorClass} ${finalTextClass} ${
        disabled ? "bg-opacity-50 cursor-default" : ""
      }`}
      type={type}
      buttonType={buttonType}
      onClick={() => onClick()}
      userEventName="button-with-dropdown-click"
      renderChildrenOnly={true}
      ref={ref}
    >
      <>
        {children && (
          <Button
            id="button-with-dropdown-children"
            type={type}
            buttonType={buttonType}
            customStyle={`col-span-2 sm:col-span-8 ${
              paddingClassMap[buttonType]
            } ${disabled ? "opacity-50" : ""}`}
            userEventName="button-with-dropdown-children-click"
          >
            {children}
          </Button>
        )}
        <Button
          id="button-with-dropdown-item"
          customStyle={`relative inline-block cursor-pointer w-full h-full py-2 ${
            children
              ? "border-l col-span-1 sm:col-span-2"
              : "col-span-full px-2"
          } ${disabled ? "opacity-50" : ""}`}
          type={type}
          buttonType={buttonType}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLaunchMenuVisible(!launchMenuVisible);
            setZIndex(!launchMenuVisible);
          }}
          userEventName="button-with-dropdown-item-click"
        >
          <span ref={wrapperRef}>
            <span
              id="open-card-menu"
              className="w-full h-full flex flex-row justify-center items-center"
            >
              {dropdownIconData}
              {launchMenuVisible ? (
                dropdownUpIcon ? (
                  dropdownUpIcon
                ) : (
                  <ChevronUpIcon
                    size={20}
                    className={`${
                      kind === "white"
                        ? "text-vryno-dropdown-icon"
                        : "text-white"
                    }`}
                  />
                )
              ) : dropdownDownIcon ? (
                dropdownDownIcon
              ) : (
                <ChevronDownIcon
                  size={20}
                  className={`${
                    kind === "white" ? "text-vryno-dropdown-icon" : "text-white"
                  }`}
                />
              )}
            </span>
            {externalLaunchMenu && launchMenuVisible
              ? externalLaunchMenu
              : launchMenuVisible && (
                  <div
                    className={`origin-top-right absolute z-[1000] mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${width} ${alignDropdownMenu}-0 ${dropdownTop} ${
                      maxHeight?.length ? `${maxHeight} overflow-y-scroll` : ""
                    }`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    {launchMenuArray &&
                      launchMenuArray
                        .filter((item) => item.visible)
                        ?.map((menuItem, index) => {
                          return (
                            <div key={index}>
                              <div
                                id={`menu-${menuItem.label}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  menuItem.onClick();
                                  handleSelectedOption(menuItem);
                                  setLaunchMenuVisible(false);
                                  setZIndex(false);
                                }}
                                className={`p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover ${width} ${
                                  menuItem.labelClasses
                                } ${
                                  menuItem.label === activeDropdown
                                    ? "bg-gray-100"
                                    : ""
                                }`}
                              >
                                <span>{menuItem.icon}</span>
                                <span className="truncate text-gray-600">
                                  {menuItem.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                )}
          </span>
        </Button>
      </>
    </Button>
  );
}
