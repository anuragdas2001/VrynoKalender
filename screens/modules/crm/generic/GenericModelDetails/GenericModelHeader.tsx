import Link from "next/link";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import LeftArrowIcon from "remixicon-react/ArrowLeftSLineIcon";
import RightArrowIcon from "remixicon-react/ArrowRightSLineIcon";
import { AllowedViews } from "../../../../../models/allowedViews";
import { IUserPreference, SupportedApps } from "../../../../../models/shared";
import { GeneralVisibilityProps } from "./IGenericFormDetails";
import React from "react";
import { ClickOutsideToClose } from "../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { kebabCase } from "lodash";
import ButtonWithDropdown from "../../../../../components/TailwindControls/Form/Button/ButtonWithDropdown";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../../shared/utils/modelNameMapperForParamUrlGenerator";

export const GenericModelHeader = ({
  setLaunchMenuVisible,
  modelName,
  heading,
  subHeading,
  id,
  appName,
  launchMenuVisible,
  editDropdownList,
  previousRecordId,
  nextRecordId,
  moduleData,
  fetchNewRecordsLoading,
  itemsCount = 0,
  setExportPdfModal,
  handleNewRecordsFetch = () => {},
  handleUpdateSectionSize,
  userPreferences,
}: {
  setLaunchMenuVisible: any;
  modelName: string;
  heading: string | React.JSX.Element;
  subHeading?: string;
  id: string;
  itemsCount?: number;
  moduleData?: any[];
  fetchNewRecordsLoading?: boolean;
  previousRecordId: string | undefined | null;
  nextRecordId: string | undefined | null;
  appName: SupportedApps;
  launchMenuVisible: GeneralVisibilityProps;
  editDropdownList: {
    icon: JSX.Element;
    label: string;
    onClick: () => void;
    labelClasses: string;
  }[];
  setExportPdfModal: (value: boolean) => void;
  handleNewRecordsFetch: (string: "next" | "previous") => void;
  handleUpdateSectionSize: (size: string) => void;
  userPreferences: IUserPreference[];
}) => {
  const wrapperRef = React.useRef(null);
  ClickOutsideToClose(wrapperRef, (value) =>
    setLaunchMenuVisible({ visible: value, id: "" })
  );

  const activeSectionView =
    userPreferences?.length &&
    userPreferences[0]?.defaultPreferences?.[modelName]?.selectedSizeView
      ? userPreferences[0]?.defaultPreferences?.[modelName]?.selectedSizeView
      : "standard";

  return (
    <GenericBackHeader
      heading={heading}
      subHeading={subHeading}
      id={id}
      addButtonInFlexCol={true}
    >
      <div className="w-full flex items-center justify-end gap-x-2">
        {previousRecordId && (
          <Link
            href={appsUrlGenerator(
              appName,
              modelName,
              AllowedViews.detail,
              previousRecordId
            )}
            legacyBehavior
          >
            <a id={`details-${previousRecordId}`}>
              <LeftArrowIcon
                className={`opacity-50 hover:opacity-90 text-vryno-theme-blue-secondary`}
              />
            </a>
          </Link>
        )}
        {!previousRecordId &&
          moduleData &&
          moduleData?.filter((data) => data)?.length < itemsCount &&
          moduleData?.findIndex((data) => data?.id === id) !== 0 && (
            <Button
              id={`fetch-new-records`}
              onClick={() => handleNewRecordsFetch("previous")}
              customStyle=""
              userEventName="generic-module-fetch-previous-record-click"
            >
              <LeftArrowIcon
                className={`opacity-50 hover:opacity-90 text-vryno-theme-blue-secondary`}
              />
            </Button>
          )}
        {nextRecordId && (
          <Link
            href={appsUrlGenerator(
              appName,
              modelName,
              AllowedViews.detail,
              nextRecordId
            )}
            legacyBehavior
          >
            <a id={`details-${nextRecordId}`}>
              <RightArrowIcon
                className={`opacity-50 hover:opacity-90 text-vryno-theme-blue-secondary`}
              />
            </a>
          </Link>
        )}
        {!nextRecordId &&
          moduleData &&
          moduleData?.filter((data) => data)?.length < itemsCount &&
          moduleData?.findIndex((data) => data?.id === id) !==
            itemsCount - 1 && (
            <Button
              id={`fetch-new-records`}
              onClick={() => handleNewRecordsFetch("next")}
              customStyle=""
              userEventName="generic-module-fetch-next-record-click"
            >
              <RightArrowIcon
                className={`opacity-50 hover:opacity-90 text-vryno-theme-blue-secondary`}
              />
            </Button>
          )}
        <div>
          <ButtonWithDropdown
            id={`${modelName}-view-options`}
            onClick={() => {}}
            kind="white"
            width="w-28"
            launchMenuArray={[
              {
                label: "Standard",
                onClick: () => handleUpdateSectionSize("standard"),
                visible: true,
                labelClasses: `${
                  activeSectionView === "standard" &&
                  "bg-vryno-theme-light-blue"
                }`,
              },
              {
                label: "No Limit",
                onClick: () => handleUpdateSectionSize("noLimit"),
                visible: true,
                labelClasses: `${
                  activeSectionView === "noLimit" && "bg-vryno-theme-light-blue"
                }`,
              },
            ]}
            dropdownDownIcon={
              <ChevronDownIcon
                size={16}
                className="text-vryno-theme-light-blue"
              />
            }
            dropdownUpIcon={
              <ChevronUpIcon
                size={16}
                className="text-vryno-theme-light-blue"
              />
            }
          />
        </div>
        <div
          className="h-9 w-28 rounded-md p-1 grid grid-cols-10 border border-vryno-button-border pl-2"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
          }}
        >
          <Link
            href={appsUrlGenerator(
              appName,
              modelName,
              AllowedViews.edit,
              id,
              modelNameValuesWithSystemSubForm.includes(modelName)
                ? [
                    `?subform=${
                      modelNameMapperForParamURLGenerator(modelName)?.subForm
                    }&&dependingModule=product&&subformfield=${
                      modelNameMapperForParamURLGenerator(modelName)
                        ?.subFormFieldLinked
                    }`,
                  ]
                : []
            )}
            legacyBehavior
          >
            <a
              id={`edit-${kebabCase(modelName)}`}
              data-testid={`edit-${kebabCase(modelName)}`}
              className="col-span-8 border-r border-vryno-content-divider flex flex-row items-center justify-center"
            >
              <EditBoxIcon
                size={17}
                className="text-vryno-theme-light-blue mr-2"
              />
              <span className="text-xsm font-medium text-gray-500">Edit</span>
            </a>
          </Link>
          <div className="col-span-2 relative inline-block text-left cursor-pointer">
            <Button
              id={`action-open-card-menu`}
              onClick={(e) => {
                e.preventDefault();
                setLaunchMenuVisible({
                  visible: !launchMenuVisible.visible,
                  id: id,
                });
              }}
              customStyle="flex h-full w-full items-center justify-center"
              userEventName="generic-module-header:action-click"
            >
              <span className="w-full h-full flex flex-row justify-center items-center">
                {launchMenuVisible.visible ? (
                  <ChevronUpIcon size={15} className="text-gray-500" />
                ) : (
                  <ChevronDownIcon size={15} className="text-gray-500" />
                )}
              </span>
            </Button>
            {launchMenuVisible.visible && launchMenuVisible["id"] === id && (
              <div
                className="origin-top-right z-10 absolute -right-1 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                ref={wrapperRef}
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                {editDropdownList.map((menuItem, index) => {
                  return (
                    <Button
                      key={index}
                      id={`${menuItem.label}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        menuItem.onClick();
                        setLaunchMenuVisible({
                          visible: !launchMenuVisible.visible,
                          id: null,
                        });
                      }}
                      customStyle={`w-full p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover ${menuItem.labelClasses}`}
                      userEventName=""
                      renderChildrenOnly={true}
                    >
                      <>
                        <span>{menuItem.icon}</span>
                        <span
                          className="text-black truncate"
                          data-testid={`${modelName}-${menuItem.label}`}
                        >
                          {menuItem.label}
                        </span>
                      </>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </GenericBackHeader>
  );
};
