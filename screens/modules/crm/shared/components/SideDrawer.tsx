import CloseIcon from "remixicon-react/CloseLineIcon";
import MobileMenuIcon from "remixicon-react/MenuUnfoldLineIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { MobileApplicationLogo } from "./MobileApplicationLogo";
import { SideMenuLoader } from "../../../../../components/TailwindControls/ContentLoader/SideMenuLoader";
import React from "react";

export const SideDrawer = ({
  sideMenuClass,
  setSideMenuClass,
  buttonType = "normal",
  children,
  menuLoading = false,
  menuItems = [],
  modelName,
  onMenuItemChange = () => {},
  childrenClasses = "",
  buttonLabel = "Menu",
  screenBreakpoint = "sm",
}: {
  sideMenuClass: string;
  setSideMenuClass: (className: string) => void;
  buttonType?:
    | "thin"
    | "normal"
    | "icon"
    | "iconInverted"
    | "pointedDownBox"
    | "pointedRightBox";
  children?: React.ReactElement;
  menuLoading?: boolean;
  menuItems?: { label: string; name: string }[];
  modelName?: string;
  onMenuItemChange?: (item: { label: string; name: string }) => void;
  childrenClasses?: string;
  buttonLabel?: string;
  screenBreakpoint?: "sm" | "md" | "lg" | "xl";
}) => {
  const [currentPageNavigation, setCurrentPageNavigation] = React.useState<{
    label: string;
    name: string;
  }>();

  React.useEffect(() => {
    setCurrentPageNavigation(
      menuItems.filter((item) => item.name === modelName)[0]
    );
  }, [menuItems]);

  return (
    <div className={`ml-6 ${screenBreakpoint}:hidden`}>
      <Button
        id="mobile-menu"
        onClick={() => setSideMenuClass("")}
        buttonType={buttonType}
        userEventName="sideDrawer-open:action-click"
      >
        <span className="flex items-center">
          <MobileMenuIcon size={22} className="mx-2" />
          {buttonLabel}
        </span>
      </Button>
      {
        <div
          className={`sidebar w-full min-h-screen overflow-y-scroll fixed inset-y-0 left-0 transform transition duration-200 ease-in-out z-[2000] ${sideMenuClass} ${screenBreakpoint}:hidden`}
        >
          <div className="bg-white shadow-lg w-7/12 min-h-screen">
            <div className="flex justify-between items-center">
              <span>
                <MobileApplicationLogo />
              </span>
              <Button
                id="side-drawer-close-icon"
                customStyle="sidebar-menu-button mr-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setSideMenuClass("-translate-x-full");
                }}
                userEventName="sideDrawer-close:action-click"
              >
                <CloseIcon
                  size={30}
                  className="text-vryno-navbar-name-container"
                />
              </Button>
            </div>
            <div className={`px-4 ${childrenClasses}`}>
              {menuItems.length ? (
                <>
                  {menuLoading ? (
                    <SideMenuLoader />
                  ) : (
                    menuItems.map((item, index) => (
                      <a
                        className={`text-sm block py-1.5 px-4 my-1 cursor-pointer hover:bg-gray-100 break-all ${
                          currentPageNavigation === item
                            ? "bg-gray-100 text-vryno-theme-light-blue border-l-4 border-vryno-theme-light-blue"
                            : ""
                        }`}
                        href={`#${item}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onMenuItemChange(item);
                          setCurrentPageNavigation(item);
                        }}
                        key={index}
                      >
                        {item.label}
                      </a>
                    ))
                  )}
                </>
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      }
    </div>
  );
};
