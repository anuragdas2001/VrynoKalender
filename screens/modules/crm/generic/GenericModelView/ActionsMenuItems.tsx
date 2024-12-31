import PhoneIcon from "remixicon-react/PhoneLineIcon";
import TaskIcon from "remixicon-react/TaskLineIcon";
import MeetingIcon from "remixicon-react/CalendarLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import React from "react";
import {
  IGenericConversionFormData,
  SupportedApps,
} from "../../../../../models/shared";
import { IDeleteModalState } from "./exportGenericModelDashboardTypes";
import Link from "next/link";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../models/allowedViews";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import { ClickOutsideToClose } from "../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import FileLineIcon from "remixicon-react/FileLineIcon";
import router from "next/router";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import FileCopyIcon from "remixicon-react/FileCopyLineIcon";
import _ from "lodash";
import { paramCase } from "change-case";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../../shared/utils/modelNameMapperForParamUrlGenerator";

interface IExtendedMenuItem {
  icon: JSX.Element;
  label: string;
  labelClasses?: string;
  onClick: () => void;
}

function ExtendedMenuItems(props: {
  onCreateCallLog: () => void;
  onCreateTask: () => void;
  onScheduleMeeting: () => void;
  modelName: string;
  onCloneRecord: () => void;
  onDeleteModel: () => void;
  menuRenderFunc: (menuItem: IExtendedMenuItem, index: number) => JSX.Element;
  id: string;
  currentModuleLabel: string;
  navActivityModuleLabels: {
    task: string | null;
    meeting: string | null;
    callLog: string | null;
  };
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
  item: Record<string, string>;
}) {
  const { appName } = getAppPathParts();

  const dropdownArray = [];
  if (props.navActivityModuleLabels.callLog)
    dropdownArray.push({
      icon: <PhoneIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Create ${props.navActivityModuleLabels.callLog}`,
      onClick: props.onCreateCallLog,
      labelClasses: "",
    });
  if (props.navActivityModuleLabels.task)
    dropdownArray.push({
      icon: <TaskIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Create ${props.navActivityModuleLabels.task}`,
      onClick: props.onCreateTask,
      labelClasses: "",
    });
  if (props.navActivityModuleLabels.meeting)
    dropdownArray.push({
      icon: <MeetingIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Schedule ${props.navActivityModuleLabels.meeting}`,
      onClick: props.onScheduleMeeting,
      labelClasses: "",
    });

  dropdownArray.push({
    icon: <FileCopyIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
    label: `Clone ${props.currentModuleLabel}`,
    onClick: props.onCloneRecord,
    labelClasses: "",
  });
  dropdownArray.push({
    icon: <DeleteBinIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
    label: `Delete ${props.currentModuleLabel}`,
    onClick: props.onDeleteModel,
    labelClasses: "",
  });
  if (props.modelName === "lead") {
    dropdownArray.push({
      icon: (
        <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
      ),
      label: `Convert`,
      onClick: () => {
        router?.replace(
          appsUrlGenerator(
            appName,
            props.modelName,
            AllowedViews.conversion,
            props.id
          )
        );
      },
      labelClasses: "",
    });
  }
  if (
    props.modelName === "quote" &&
    !_.get(props.item, "quoteConverted", false)
  ) {
    dropdownArray.push(
      ...[
        {
          icon: (
            <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
          ),
          label: `Convert to ${props.salesOrderModuleLabel}`,
          onClick: () =>
            props.setDisplayConversionModal({
              data: {
                convertToModuleLabel: props.salesOrderModuleLabel,
                id: props.id,
                modelName: "quoteToSalesOrder",
              },
              visible: true,
            }),
          labelClasses: "",
        },
        {
          icon: (
            <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
          ),
          label: `Convert to ${props.invoiceModuleLabel}`,
          onClick: () =>
            props.setDisplayConversionModal({
              data: {
                convertToModuleLabel: props.invoiceModuleLabel,
                id: props.id,
                modelName: "quoteToInvoice",
              },
              visible: true,
            }),
          labelClasses: "",
        },
      ]
    );
  }
  if (
    props.modelName === "salesOrder" &&
    !_.get(props.item, "salesOrderConverted", false)
  ) {
    dropdownArray.push(
      ...[
        {
          icon: (
            <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
          ),
          label: `Convert to ${props.invoiceModuleLabel}`,
          onClick: () =>
            props.setDisplayConversionModal({
              data: {
                convertToModuleLabel: props.invoiceModuleLabel,
                id: props.id,
                modelName: "salesOrderToInvoice",
              },
              visible: true,
            }),
          labelClasses: "",
        },
      ]
    );
  }
  return dropdownArray.map(props.menuRenderFunc);
}

export function ActionsMenuItems({
  appName,
  isLinkEnabled,
  item,
  modelName,
  launchMenuVisible,
  currentModuleLabel,
  navActivityModuleLabels,
  isDropdownUpward,
  setExtendedMenuVisible,
  menuRenderFunc,
  onCreateCallLog,
  onCreateTask,
  onDeleteModel,
  onCloneRecord,
  onScheduleMeeting,
  setIsDropdownUpward,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  setDisplayConversionModal,
}: {
  appName: SupportedApps;
  isLinkEnabled: boolean;
  modelName: string;
  item: Record<string, string>;
  launchMenuVisible: IDeleteModalState;
  isDropdownUpward: {
    id: string;
    visible: boolean;
  };
  currentModuleLabel: string;
  navActivityModuleLabels: {
    task: string | null;
    meeting: string | null;
    callLog: string | null;
  };
  onCreateCallLog: () => void;
  onCreateTask: () => void;
  onScheduleMeeting: () => void;
  onDeleteModel: () => void;
  onCloneRecord: () => void;
  menuRenderFunc: (menuItem: IExtendedMenuItem, index: number) => JSX.Element;
  setIsDropdownUpward: React.Dispatch<
    React.SetStateAction<{
      id: string;
      visible: boolean;
    }>
  >;
  setExtendedMenuVisible: (item: IDeleteModalState) => void;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
}) {
  const wrapperRefInner = React.useRef(null);
  ClickOutsideToClose(wrapperRefInner, (value: boolean) => {
    setExtendedMenuVisible({ id: "", visible: value });
    setIsDropdownUpward({ id: "", visible: false });
  });
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLinkEnabled) return;
    if (!launchMenuVisible) return;
    const rect = (wrapperRefInner.current as any).getBoundingClientRect();
    const dropdownIsUpward = window.innerHeight - rect.bottom < 200;
    setIsDropdownUpward({ id: item.id, visible: dropdownIsUpward });
    setExtendedMenuVisible({
      id: !launchMenuVisible.visible ? item.id : "",
      visible: !launchMenuVisible.visible,
    });
  };

  return (
    <div
      className="text-gray-500 h-9 relative w-28 rounded-md grid grid-cols-10 border border-vryno-button-border"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
      }}
    >
      <Link
        legacyBehavior
        href={appsUrlGenerator(
          appName,
          modelName,
          AllowedViews.edit,
          item.id,
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
      >
        <a
          id={`edit-${_.get(item, "name", "")}`}
          data-testid={paramCase(`edit-${_.get(item, "name", "")}`)}
          className={`col-span-7 border-r border-vryno-content-divider flex flex-row items-center justify-center ${
            !isLinkEnabled ? "pointer-events-none opacity-60" : ""
          }`}
          aria-disabled={!isLinkEnabled}
        >
          <EditBoxIcon size={17} className="text-vryno-theme-light-blue mr-2" />
          <span className="text-xsm font-medium">Edit</span>
        </a>
      </Link>
      <div
        ref={wrapperRefInner}
        className={`col-span-3 relative inline-block ${
          !isLinkEnabled ? "pointer-events-none opacity-60" : "cursor-pointer"
        }`}
      >
        <Button
          id={`action-menu-button-${_.get(item, "name", "")}`}
          customStyle="flex h-full w-full items-center justify-center"
          userEventName="action-menu-dropdown:toggle-click"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLinkEnabled) return;
            if (!launchMenuVisible) return;
            handleButtonClick(e, item);
          }}
        >
          <span className="w-full h-full flex flex-row justify-center items-center">
            {launchMenuVisible.visible &&
            launchMenuVisible["id"] === item["id"] ? (
              <ChevronUpIcon size={15} className="text-gray-500" />
            ) : (
              <ChevronDownIcon size={15} className="text-gray-500" />
            )}
          </span>
        </Button>
        {launchMenuVisible.visible &&
          launchMenuVisible["id"] === item["id"] && (
            <div
              className={`origin-top-right flex flex-col absolute z-40 -right-1 ${
                isDropdownUpward.visible && isDropdownUpward.id === item["id"]
                  ? "-bottom-0"
                  : "top-10"
              } mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              style={{
                marginTop:
                  isDropdownUpward.visible && isDropdownUpward.id === item["id"]
                    ? "0px"
                    : "2px",
                marginBottom:
                  isDropdownUpward.visible && isDropdownUpward.id === item["id"]
                    ? "2.5rem"
                    : "",
              }}
            >
              <ExtendedMenuItems
                onCreateCallLog={onCreateCallLog}
                onCreateTask={onCreateTask}
                onScheduleMeeting={onScheduleMeeting}
                modelName={modelName}
                onCloneRecord={onCloneRecord}
                onDeleteModel={onDeleteModel}
                menuRenderFunc={menuRenderFunc}
                id={item["id"]}
                item={item}
                currentModuleLabel={currentModuleLabel}
                navActivityModuleLabels={navActivityModuleLabels}
                salesOrderModuleLabel={salesOrderModuleLabel}
                invoiceModuleLabel={invoiceModuleLabel}
                setDisplayConversionModal={setDisplayConversionModal}
              />
            </div>
          )}
      </div>
    </div>
  );
}
