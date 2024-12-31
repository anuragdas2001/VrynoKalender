import Link from "next/link";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import ClipboardIcon from "remixicon-react/ClipboardLineIcon";
import { ClickOutsideToClose } from "../../../components/TailwindControls/shared/ClickOutsideToClose";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import ExternalLinkIcon from "remixicon-react/LoginCircleLineIcon";
import DomainTrackingIcon from "remixicon-react/MailSettingsLineIcon";
import { IInstance } from "../../../models/Accounts";
import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { IDeleteModalState } from "../crm/generic/GenericModelView/exportGenericModelDashboardTypes";
import { Config } from "../../../shared/constants";
import { cookieUserStore } from "../../../shared/CookieUserStore";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import BuildingIcon from "remixicon-react/BuildingLineIcon";

export const InstanceListActionComponent = ({
  activeId,
  data,
  isDropdownUpward,
  setDeleteModal,
  setEditModal,
  setRemoveSampleDataModal,
  setIsDropdownUpward,
}: {
  activeId: string;
  data: IInstance[];
  isDropdownUpward: {
    id: string;
    visible: boolean;
  };
  setDeleteModal: (deleteModal: IDeleteModalState) => void;
  setEditModal?: (ediModal: IDeleteModalState) => void;
  setRemoveSampleDataModal?: (sampleDataRemove: {
    visible: boolean;
    item: IInstance;
  }) => void;
  setIsDropdownUpward: React.Dispatch<
    React.SetStateAction<{
      id: string;
      visible: boolean;
    }>
  >;
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { locale } = router;
  const [launchMenuVisible, setLaunchMenuVisible] = React.useState(false);
  const wrapperRef = React.useRef(null);
  const dropdownClass = `p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover w-44`;
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

  const isUserAdminInInstance = (data: IInstance) => {
    return data.instanceAdmins.filter(
      (instanceData) => instanceData === cookieUserStore.getUserDetails()?.email
    );
  };

  const isUserInstanceOwner = (data: IInstance) =>
    data.created_by === cookieUserStore.getUserId();

  return (
    <>
      {data
        .filter((val) => val.id === activeId)
        .map((item, outerIndex) => {
          return (
            <div
              className="w-full flex flex-row justify-start"
              key={outerIndex}
            >
              <div
                className={`h-9 w-28 rounded-md p-1 grid border border-vryno-button-border grid-cols-10`}
                style={{
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
                }}
              >
                {isUserAdminInInstance(item).length > 0 ? (
                  <Link
                    legacyBehavior
                    href={`${Config.publicRootUrl({
                      appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
                      appSubDomain: item?.subdomain,
                    })}${locale}/${Config.crmApplicationPath}`}
                  >
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          `${Config.publicRootUrl({
                            appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
                            appSubDomain: item?.subdomain,
                          })}${locale}/${Config.crmApplicationPath}`
                        );
                      }}
                      className={`col-span-8 flex flex-row items-center justify-center border-r border-vryno-content-divider`}
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
                ) : !isUserInstanceOwner(item) ? (
                  <Link
                    legacyBehavior
                    href={`${Config.publicRootUrl({
                      appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
                      appSubDomain: item?.subdomain,
                    })}${locale}/${Config.crmApplicationPath}`}
                  >
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          `${Config.publicRootUrl({
                            appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
                            appSubDomain: item?.subdomain,
                          })}${locale}/${Config.crmApplicationPath}`
                        );
                      }}
                      className="col-span-8  border-vryno-content-divider flex flex-row items-center justify-center"
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
                  <Link href="" legacyBehavior>
                    <a
                      id="edit-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditModal &&
                          setEditModal({ visible: true, id: item.id });
                      }}
                      className="col-span-8  border-r border-vryno-content-divider flex flex-row items-center justify-center"
                    >
                      <EditBoxIcon
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
                  ref={wrapperRef}
                  className={`col-span-2 relative inline-block text-left cursor-pointer ${
                    isUserAdminInInstance(item).length > 0
                      ? ""
                      : !isUserInstanceOwner(item)
                      ? "hidden"
                      : ""
                  }`}
                >
                  <Button
                    id="instance-list-action"
                    customStyle="flex h-full w-full items-center justify-center"
                    userEventName="instance-list:action-click"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLaunchMenuVisible(!launchMenuVisible);
                      handleButtonClick(e, item);
                    }}
                  >
                    <span className="w-full h-full flex flex-row justify-center items-center">
                      {launchMenuVisible ? (
                        <ChevronUpIcon size={15} className="text-gray-500" />
                      ) : (
                        <ChevronDownIcon size={15} className="text-gray-500" />
                      )}
                    </span>
                  </Button>
                  {launchMenuVisible && (
                    <div
                      className={`origin-top-right flex flex-col absolute z-40 -right-1 ${
                        isDropdownUpward.visible &&
                        isDropdownUpward.id === item.id
                          ? "-bottom-0"
                          : "top-10"
                      } mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                      style={{
                        marginTop:
                          isDropdownUpward.visible &&
                          isDropdownUpward.id === item.id
                            ? "0px"
                            : "2px",
                        marginBottom:
                          isDropdownUpward.visible &&
                          isDropdownUpward.id === item.id
                            ? "2.5rem"
                            : "",
                      }}
                    >
                      {[
                        {
                          icon: (
                            <EditBoxIcon
                              size={16}
                              className="mr-2 text-vryno-dropdown-icon"
                            />
                          ),
                          label: `Edit`,
                          onClick: () =>
                            router.push(`/instances/edit?id=${item.id}`),
                          labelClasses: `${
                            isUserAdminInInstance(item).length > 0
                              ? "sm:hidden"
                              : !isUserInstanceOwner(item)
                              ? "hidden"
                              : "hidden "
                          }`,
                        },
                        {
                          icon: (
                            <EditBoxIcon
                              size={16}
                              className="mr-2 text-vryno-dropdown-icon"
                            />
                          ),
                          label: `Edit`,
                          onClick: () => {
                            router.push(`/instances?id=${item.id}`);
                            setEditModal &&
                              setEditModal({ visible: true, id: item.id });
                          },
                          labelClasses: `hidden ${
                            isUserAdminInInstance(item).length > 0
                              ? "sm:flex "
                              : !isUserInstanceOwner(item)
                              ? "hidden"
                              : "hidden"
                          }`,
                        },
                        {
                          icon: (
                            <BuildingIcon
                              size={16}
                              className="mr-2 text-vryno-dropdown-icon"
                            />
                          ),
                          label: "Company",
                          id: "company",
                          onClick: () =>
                            router.push(
                              `${Config.publicRootUrl({
                                appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
                                appSubDomain: item?.subdomain,
                              })}/company-details/${item.id}`
                            ),
                        },
                        {
                          icon: (
                            <ClipboardIcon
                              size={16}
                              className="mr-2 text-vryno-dropdown-icon"
                            />
                          ),
                          label: `Delete Sample Data`,
                          onClick: () =>
                            setRemoveSampleDataModal &&
                            setRemoveSampleDataModal({
                              visible: true,
                              item: item,
                            }),
                          labelClasses: `${
                            item.isSample
                              ? isUserAdminInInstance(item).length > 0
                                ? "flex"
                                : !isUserInstanceOwner(item)
                                ? "hidden"
                                : "flex"
                              : "hidden"
                          }`,
                        },
                        {
                          icon: (
                            <DeleteBinIcon
                              size={16}
                              className="mr-2 text-vryno-dropdown-icon"
                            />
                          ),
                          label: `Delete`,
                          onClick: () =>
                            setDeleteModal({ visible: true, id: item.id }),
                          labelClasses: `${
                            isUserAdminInInstance(item).length > 0
                              ? "flex"
                              : !isUserInstanceOwner(item)
                              ? "hidden"
                              : "flex"
                          }`,
                        },
                      ].map((menuItem, index) => {
                        return (
                          <Link href="" key={index} legacyBehavior>
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                menuItem.onClick();
                              }}
                              className={`${dropdownClass} ${
                                menuItem.labelClasses || ""
                              }`}
                            >
                              <span>{menuItem.icon}</span>{" "}
                              <span className="text-black">
                                {menuItem.label}
                              </span>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};
