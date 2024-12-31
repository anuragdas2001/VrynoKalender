import { getNavigationList } from "../../modules/crm/shared/utils/getNavigationList";
import Link from "next/link";
import CloseIcon from "remixicon-react/CloseLineIcon";
import { getAppPathParts } from "../../modules/crm/shared/utils/getAppPathParts";
import { MobileApplicationLogo } from "../../modules/crm/shared/components/MobileApplicationLogo";
import { INavigation } from "../../../models/INavigation";
import React from "react";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { useRouter } from "next/router";

export const MobileMenu = ({
  navbarColor,
  navbarTextColor,
  navigations,
  sideModalClass,
  setSideModalClass,
  instanceName,
}: {
  navbarColor?: string;
  navbarTextColor?: string;
  navigations: INavigation[];
  sideModalClass: string;
  setSideModalClass: (className: string) => void;
  instanceName: string;
}) => {
  const router = useRouter();
  const { modelName } = getAppPathParts();
  return (
    <div
      className={`z-[2000] sidebar w-full min-h-screen overflow-y-scroll absolute inset-y-0 left-0 sm:hidden transform transition duration-200 ease-in-out ${sideModalClass}`}
    >
      <div
        style={{
          backgroundColor: navbarColor ?? "white",
          color: !navbarColor ? "black" : navbarTextColor ?? "black",
        }}
        className={`shadow-lg w-7/12 h-screen`}
      >
        <div className="flex justify-between items-center">
          <MobileApplicationLogo />
          <Button
            id="mobile-menu-close-icon"
            onClick={(e) => {
              e.preventDefault();
              setSideModalClass("-translate-x-full");
            }}
            customStyle="sidebar-menu-button text-vryno-navbar-name-container mr-2 cursor-pointer"
            userEventName="mobile-menu-close:action-click"
          >
            <CloseIcon size={30} />
          </Button>
        </div>
        <div className="sm:hidden  text-[11px] pl-4 pb-2 border-b border-gray">
          <p className="text-vryno-instance-header">Instance</p>
          <p className="">{instanceName}</p>
        </div>
        {navigations &&
          getNavigationList(navigations).map((item, index) => (
            <Link
              href={`#`}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                router
                  .push(item.link)
                  .then(() => setSideModalClass("-translate-x-full"));
              }}
              className={`text-sm block py-1.5 px-4 my-1 ${
                modelName === item.name ? "text-vryno-theme-light-blue" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
      </div>
    </div>
  );
};
