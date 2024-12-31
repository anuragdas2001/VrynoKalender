import { MainMenu } from "./MainMenu";
import { OverflowNavMenu } from "./OverflowNavMenu";
import MobileMenuIcon from "remixicon-react/Menu2LineIcon";
import { MobileMenu } from "./MobileMenu";
import React from "react";
import { getAppPathParts } from "../../modules/crm/shared/utils/getAppPathParts";
import { INavigation } from "../../../models/INavigation";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { SecureImage } from "../../../components/TailwindControls/Form/SecureImage/SecureImage";
import { Config } from "../../../shared/constants";
import { AppModels } from "../../../models/AppModels";

const webApplicationLogo: Record<string, string> = {
  vryno: "/vryno_new_logo.svg",
  crm: "/crm-logo-new.svg",
  crmwhite: "/crm-logo-white.svg",
};

function ApplicationLogo({ navbarTextColor }: { navbarTextColor: string }) {
  const { appName } = getAppPathParts();
  return webApplicationLogo[
    navbarTextColor === "white" ? "crmwhite" : appName
  ] ? (
    <>
      <img
        src={
          webApplicationLogo[navbarTextColor === "white" ? "crmwhite" : appName]
        }
        alt="logo"
        className="hidden sm:block"
      />
      <img src="/crm-logo-mobile.svg" alt="logo" className="block sm:hidden" />
    </>
  ) : (
    <img src="/crm_logo.svg" alt="logo" />
  );
}

export const ConnectedMainMenu = ({
  companyLogoData,
  instanceName,
  instanceDataLoading,
  navbarColor,
  navbarTextColor,
  filteredNavigations,
  viewPermission,
}: {
  companyLogoData: string | undefined;
  instanceName: string;
  instanceDataLoading: boolean;
  navbarColor?: string;
  navbarTextColor: string;
  filteredNavigations: INavigation[];
  viewPermission: boolean;
}) => {
  const [sideModalClass, setSideModalClass] =
    React.useState("-translate-x-full");

  const parentRef = React.useRef(null);

  return (
    <div className="flex flex-row items-center w-[calc(100%-275px)]">
      {instanceDataLoading ? (
        <div className="bg-vryno-theme-blue opacity-30 w-[121px] h-[40px] animate-pulse" />
      ) : companyLogoData ? (
        <div className="w-[121px] h-[40px]">
          <SecureImage
            url={`${Config.metaPrivateUploadUrl()}crm/${
              AppModels.Company
            }/${companyLogoData}`}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <ApplicationLogo navbarTextColor={navbarTextColor} />
      )}
      {viewPermission && (
        <MainMenu navigations={filteredNavigations} parentRef={parentRef} />
      )}
      <OverflowNavMenu
        navbarColor={navbarColor}
        navbarTextColor={navbarTextColor}
        navigations={filteredNavigations}
        parentRef={parentRef}
      />
      <Button
        id="main-menu-open-side-modal"
        customStyle="mobile-menu-button text-vryno-navbar-name-container sm:hidden ml-3 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setSideModalClass("");
        }}
        userEventName="main-menu-open-side-modal-click"
      >
        <MobileMenuIcon size={30} />
      </Button>
      <MobileMenu
        navbarColor={navbarColor}
        navbarTextColor={navbarTextColor}
        navigations={filteredNavigations}
        sideModalClass={sideModalClass}
        setSideModalClass={setSideModalClass}
        instanceName={instanceName}
      />
    </div>
  );
};
