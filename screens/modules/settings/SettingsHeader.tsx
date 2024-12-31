import { useTranslation } from "next-i18next";
import BackArrowIcon from "remixicon-react/ArrowLeftLineIcon";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import MobileMenuIcon from "remixicon-react/Menu2LineIcon";
import { SettingsSideBar } from "./SettingsSidebar";
import CloseIcon from "remixicon-react/CloseLineIcon";
import React from "react";
import { MobileApplicationLogo } from "../crm/shared/components/MobileApplicationLogo";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import SaveIcon from "remixicon-react/SaveLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";

export const SettingsHeader = function ({
  noOfItems,
  onButtonClick = () => {},
  heading,
  subHeading,
  buttonText = "",
  buttonColor = "primary",
  from,
  buttonType = "thin",
  showButton = true,
  iconType = "add",
  buttonLoading = false,
}: {
  noOfItems?: number;
  onButtonClick?: () => void;
  heading: string;
  subHeading?: string;
  buttonText?: string;
  buttonColor?:
    | "primary"
    | "secondary"
    | "back"
    | "next"
    | "danger"
    | undefined;
  from?: string;
  buttonType?: "normal" | "thin";
  showButton?: boolean;
  iconType?: "add" | "save" | "delete";
  buttonLoading?: boolean;
}) {
  const { t } = useTranslation(["customizations", "common"]);
  const [displaySideMenu, setDisplaySideMenu] = React.useState(true);
  const [sideModalClass, setSideModalClass] =
    React.useState("-translate-x-full");

  return (
    <div className="shadow-md sm:pb-0">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Button
            id="settings-header-back-button"
            onClick={onclick ? () => onclick : () => history.back()}
            customStyle=""
            userEventName="settings-header-back:action-click"
          >
            <BackArrowIcon className="text-vryno-theme-light-blue cursor-pointer" />
          </Button>
          <span className="text-md md:text-lg font-medium capitalize text-200 flex flex-col">
            {heading}
            <span className="text-sm text-vryno-theme-light-blue">
              {subHeading}
            </span>
          </span>
        </div>

        <div>
          {noOfItems !== 0 && showButton ? (
            <Button
              type="button"
              id="header-button"
              onClick={() => {
                onButtonClick();
              }}
              kind={buttonColor}
              buttonType={buttonType}
              loading={buttonLoading}
              userEventName={`settings-header-${
                iconType === "add"
                  ? "add"
                  : iconType === "save"
                  ? "save"
                  : iconType === "delete"
                  ? "delete"
                  : "button"
              }-click`}
            >
              <div className="flex">
                {iconType === "add" ? (
                  <CircleIcon size={20} className="mr-1" />
                ) : iconType === "save" ? (
                  <SaveIcon size={18} className="mr-1" />
                ) : iconType === "delete" ? (
                  <DeleteBinIcon size={18} className="mr-1" />
                ) : (
                  ""
                )}
                {t(buttonText)}
              </div>
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      {from === "settings" ? (
        <div className="ml-6 pb-3 sm:hidden">
          <Button
            id="settings-header-menu-button"
            customStyle="w-28 py-1 px-4 flex gap-1 text-lg bg-vryno-theme-light-blue rounded-md cursor-pointer text-white"
            onClick={(e) => {
              e.preventDefault();
              setSideModalClass("");
            }}
            renderChildrenOnly={true}
            userEventName="settings-header-menu:toggle-action"
          >
            <>
              <MobileMenuIcon
                size={30}
                className="mobile-menu-button text-vryno-navbar-name-container sm:hidden cursor-pointer"
              />
              <span>Menu</span>
            </>
          </Button>
          {displaySideMenu && (
            <div
              className={`sidebar w-full min-h-screen overflow-y-scroll fixed inset-y-0 left-0 sm:hidden transform ${sideModalClass} transition duration-200 z-20`}
            >
              <div className="bg-white shadow-lg w-6/12 min-h-screen">
                <div className="flex justify-between items-center">
                  <MobileApplicationLogo />
                  <Button
                    id="settings-header-close-menu"
                    onClick={(e) => {
                      e.preventDefault();
                      setSideModalClass("-translate-x-full");
                    }}
                    customStyle="sidebar-menu-button text-vryno-navbar-name-container mr-2 cursor-pointer"
                    userEventName="settings-header-side-menu-close:action-click"
                  >
                    <CloseIcon size={30} />
                  </Button>
                </div>
                <div className="px-4">
                  <SettingsSideBar />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
