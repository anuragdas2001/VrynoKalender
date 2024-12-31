import React, { useContext } from "react";
import router from "next/router";
import Link from "next/link";
import { Config } from "../../../shared/constants";
import { settingsUrlGenerator } from "../../modules/crm/shared/utils/settingsUrlGenerator";
import { observer } from "mobx-react-lite";
import { SettingsMenuItem } from "../../../models/Settings";
import { INavigation } from "../../../models/INavigation";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import InstanceIcon from "remixicon-react/FileCopyLineIcon";
import RecycleBinIcon from "remixicon-react/DeleteBinLineIcon";
import SettingsIcon from "remixicon-react/EqualizerLineIcon";
import ImportIcon from "remixicon-react/LoginBoxLineIcon";
import LogoutIcon from "remixicon-react/LogoutBoxRLineIcon";
import { generateNavigableModule } from "../../modules/crm/shared/utils/generateNavigableModule";
import { SupportedApps } from "../../../models/shared";

export const ProfileMenu = observer(
  ({
    navbarColor,
    navbarTextColor,
    dropDownListVisible,
    hideItemsFromDropdownMenu,
    setDropDownListVisible,
    appName,
  }: {
    navbarColor?: string;
    navbarTextColor: string;
    dropDownListVisible: boolean;
    hideItemsFromDropdownMenu?: string[];
    setDropDownListVisible: (visible: boolean) => void;
    appName: SupportedApps;
  }) => {
    const { navigations } = useContext(NavigationStoreContext);
    const dropdownList: Record<
      string,
      {
        icon: JSX.Element;
        id: string;
        url: string;
      }
    > = {
      instances: {
        icon: <InstanceIcon size={16} className=" mr-2" />,
        id: "profile-menu-instances",
        url: Config.publicRootUrl() + Config.instancesUrl,
      },
      "bulk-import": {
        icon: <ImportIcon size={16} className="mr-2 " />,
        url: `/bulk-import/${appName ? appName : SupportedApps.crm}/${
          navigations.length > 0 &&
          generateNavigableModule({
            navigations,
            groupKey: "default-navigation",
            pathName: "bulk-import",
          })
        }/jobs`,
        id: "profile-menu-recycle-bin",
      },
      "recycle-bin": {
        icon: <RecycleBinIcon size={16} className="mr-2 " />,
        url: `/recycle-bin/${appName ? appName : SupportedApps.crm}/${
          navigations.length > 0 &&
          generateNavigableModule({
            navigations,
            groupKey: "default-navigation",
            pathName: "recycle-bin",
          })
        }`,
        id: "profile-menu-recycle-bin",
      },
      settings: {
        icon: <SettingsIcon size={16} className="mr-2 " />,
        id: "profile-menu-settings",
        url: settingsUrlGenerator(
          appName ? appName : SupportedApps.crm,
          SettingsMenuItem.personalSettings
        ),
      },
      logout: {
        icon: <LogoutIcon size={16} className="mr-2 " />,
        url: "/logout",
        id: "profile-menu-logout",
      },
    };

    if (!dropDownListVisible) {
      return null;
    }

    const emailAndProfileNav = navigations.filter(
      (val) => val.groupKey === "profile-menu"
    );

    return (
      <div
        className="origin-top-right absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        id="navbarMenu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        {emailAndProfileNav.length
          ? emailAndProfileNav.map((item: INavigation, index: number) => (
              <Link
                // href={{ pathname: dropdownList[item.uniqueName].url }}
                href={dropdownList[item.uniqueName].url}
                key={index}
                passHref
                legacyBehavior
              >
                <a
                  id={dropdownList[item.uniqueName]?.id}
                  data-testid={dropdownList[item.uniqueName]?.id}
                  className={`p-2 cursor-pointer flex flex-row items-center ${
                    emailAndProfileNav.length === 1 ? "" : "border-b"
                  } border-gray-100 hover:opacity-70 ${
                    hideItemsFromDropdownMenu?.includes(item.uniqueName)
                      ? "hidden"
                      : ""
                  }`}
                  style={{
                    backgroundColor: navbarColor ?? "white",
                    color: !navbarColor ? "black" : navbarTextColor ?? "black",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(dropdownList[item.uniqueName].url);
                    setDropDownListVisible(false);
                  }}
                >
                  {dropdownList[item.uniqueName]?.icon}
                  <span
                    className={`text-xs text-${
                      navbarTextColor ? navbarTextColor : "gray-400"
                    }`}
                    data-testid={item.label.en}
                  >
                    {item.label.en}
                  </span>
                </a>
              </Link>
            ))
          : [
              {
                label: "Instances",
                icon: <InstanceIcon size={16} className=" mr-2" />,
                id: "profile-menu-instances",
                uniqueName: "instances",
                url: Config.publicRootUrl() + Config.instancesUrl,
              },
              {
                label: "Logout",
                icon: <LogoutIcon size={16} className="mr-2 " />,
                url: "/logout",
                uniqueName: "logout",
                id: "profile-menu-logout",
              },
            ].map((item, index) => (
              <Link href={``} key={index} passHref legacyBehavior>
                <a
                  id={item.id}
                  data-testid={item.id}
                  className={`p-2 cursor-pointer flex flex-row items-center ${
                    emailAndProfileNav.length === 1 ? "" : "border-b"
                  }  border-gray-100 hover:opacity-70 ${
                    hideItemsFromDropdownMenu?.includes(item.uniqueName)
                      ? "hidden"
                      : ""
                  }`}
                  style={{
                    backgroundColor: navbarColor ?? "white",
                    color: !navbarColor ? "black" : navbarTextColor ?? "black",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.url);
                    setDropDownListVisible(false);
                  }}
                >
                  {item.icon}
                  <span
                    className={`text-xs text-${
                      navbarTextColor ? navbarTextColor : "gray-400"
                    }`}
                    data-testid={item.label}
                  >
                    {item.label}
                  </span>
                </a>
              </Link>
            ))}
      </div>
    );
  }
);
