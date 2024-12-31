import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import ExternalLinkIcon from "remixicon-react/LoginCircleLineIcon";
import GenericCard from "../../../components/TailwindControls/Cards/GenericCard";
import { ClickOutsideToClose } from "../../../components/TailwindControls/shared/ClickOutsideToClose";
import { GenericListHeaderType } from "../../../components/TailwindControls/Lists/GenericList";
import { cookieUserStore } from "../../../shared/CookieUserStore";
import EditBoxLineIcon from "remixicon-react/EditBoxLineIcon";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import _ from "lodash";
import { IInstance } from "../../../models/Accounts";
import { SupportedApps } from "../../../models/shared";

export type InstanceCardType = {
  children?: React.ReactElement;
  visibleHeaders: Array<GenericListHeaderType>;
  hideShowHeaders: Array<GenericListHeaderType>;
  data: IInstance;
  launchUrl: string;
  launchMenuArray?: Array<{
    icon: React.JSX.Element;
    label: string;
    id: string;
    onClick: () => void;
    labelClasses?: string;
    visible?: boolean;
  }>;
  modelName: string;
  handleOwnerClick: () => void;
};

export default function InstanceCard({
  children,
  visibleHeaders,
  hideShowHeaders,
  data,
  launchUrl,
  launchMenuArray,
  modelName,
  handleOwnerClick = () => {},
}: InstanceCardType) {
  const [launchMenuVisible, setLaunchMenuVisible] = React.useState(false);
  const { t } = useTranslation("common");

  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value: boolean) =>
    setLaunchMenuVisible(value)
  );

  const [isUserAdminInInstance, setIsUserAdminInInstance] = React.useState<
    string[]
  >([]);
  const [isUserInstanceOwner, setIsUserInstanceOwner] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      data &&
      Object.keys(data).length > 0 &&
      cookieUserStore.getUserDetails()?.email &&
      cookieUserStore.getUserId()
    ) {
      const isUserAdminInInstance = data.instanceAdmins.filter(
        (instanceData) =>
          instanceData.toLowerCase() ===
          cookieUserStore.getUserDetails()?.email.toLowerCase()
      );
      const isUserInstanceOwner =
        data.created_by === cookieUserStore.getUserId();
      setIsUserAdminInInstance(isUserAdminInInstance);
      setIsUserInstanceOwner(isUserInstanceOwner);
    }
  }, [
    data,
    cookieUserStore.getUserDetails()?.email,
    cookieUserStore.getUserId(),
  ]);

  let updatedLaunchMenuArray =
    isUserAdminInInstance.length > 0
      ? launchMenuArray
      : !isUserInstanceOwner
      ? []
      : launchMenuArray?.filter((menu) => menu.label !== "Edit");

  return (
    <GenericCard
      visibleHeaders={visibleHeaders}
      hideShowHeaders={hideShowHeaders}
      data={data}
      onItemSelect={() => {}}
      cardSelector={false}
      headerLink={
        isUserAdminInInstance.length > 0
          ? launchUrl
          : !isUserInstanceOwner
          ? launchUrl
          : undefined
      }
      modelName={modelName}
      innerMaxHeight={"max-h-[96px]"}
      cardHeading={`${_.get(data, "name", "")}`}
      headingColor={"text-vryno-theme-light-blue"}
      imageServiceName={SupportedApps.crm}
      imageServiceModelName={"Company"}
      imageServiceSubdomain={data.subdomain}
    >
      <>
        <div className="border-t w-full flex flex-row justify-end col-span-2">
          <div
            className="h-9 w-28 rounded-md mt-2 grid grid-cols-10 border border-vryno-button-border"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
            }}
          >
            {isUserAdminInInstance.length > 0 ? (
              <Link legacyBehavior href={launchUrl}>
                <a
                  id="launch-button"
                  className="col-span-8  border-r border-vryno-content-divider flex flex-row items-center justify-center"
                >
                  <ExternalLinkIcon
                    size={17}
                    className="text-vryno-theme-light-blue mr-2"
                  />
                  <span className="text-xsm font-medium text-gray-500">
                    {t("common:launch-link")}
                  </span>
                </a>
              </Link>
            ) : !isUserInstanceOwner ? (
              <Link legacyBehavior href={launchUrl}>
                <a
                  id="launch-button"
                  className="col-span-10  border-vryno-content-divider flex flex-row items-center justify-center"
                >
                  <ExternalLinkIcon
                    size={17}
                    className="text-vryno-theme-light-blue mr-2"
                  />
                  <span className="text-xsm font-medium text-gray-500">
                    {t("common:launch-link")}
                  </span>
                </a>
              </Link>
            ) : (
              <Link legacyBehavior href="">
                <a
                  id="edit-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOwnerClick();
                  }}
                  className="col-span-8  border-r border-vryno-content-divider flex flex-row items-center justify-center"
                >
                  <EditBoxLineIcon
                    size={17}
                    className="text-vryno-theme-light-blue mr-2"
                  />
                  <span className="text-xsm font-medium text-gray-500">
                    {t("common:Edit")}
                  </span>
                </a>
              </Link>
            )}
            <div
              className={`col-span-2 relative inline-block text-left cursor-pointer ${
                isUserAdminInInstance.length > 0
                  ? ""
                  : !isUserInstanceOwner
                  ? "hidden"
                  : ""
              }`}
            >
              <Button
                id="instance-card-action"
                customStyle="flex h-full w-full items-center justify-center"
                userEventName="instance-card:action-click"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLaunchMenuVisible(!launchMenuVisible);
                }}
              >
                <span
                  id="open-card-menu"
                  className="w-full h-full flex flex-row justify-center items-center"
                >
                  {launchMenuVisible ? (
                    <ChevronUpIcon size={15} className="text-gray-500" />
                  ) : (
                    <ChevronDownIcon size={15} className="text-gray-500" />
                  )}
                </span>
              </Button>
              {launchMenuVisible && (
                <div
                  className="origin-top-right absolute right-0 z-10 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  ref={wrapperRef}
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  {updatedLaunchMenuArray &&
                    updatedLaunchMenuArray.map((menuItem, index) => (
                      <Link href="" key={index} legacyBehavior>
                        <a
                          id={`menu-${menuItem.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            menuItem.onClick();
                            setLaunchMenuVisible(!launchMenuVisible);
                          }}
                          className={`p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs ${menuItem.labelClasses} hover:bg-vryno-dropdown-hover`}
                        >
                          <span>
                            <>{menuItem.icon}</>
                          </span>
                          <span className="text-black">{menuItem.label}</span>
                        </a>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </GenericCard>
  );
}
