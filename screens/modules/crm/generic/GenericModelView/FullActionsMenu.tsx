import {
  IGenericConversionFormData,
  SupportedApps,
} from "../../../../../models/shared";
import { IDeleteModalState } from "./exportGenericModelDashboardTypes";
import React from "react";
import { ActionsMenuItems } from "./ActionsMenuItems";
import { IFormModalObject } from "./GenericModelList";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../models/allowedViews";
import router from "next/router";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../../shared/utils/modelNameMapperForParamUrlGenerator";

export function FullActionsMenu({
  data,
  appName,
  modelName,
  currentModuleLabel,
  navActivityModuleLabels,
  isDropdownUpward,
  setFormModal,
  setDeleteModal,
  setIsDropdownUpward,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  setDisplayConversionModal,
}: {
  data: Record<string, string>;
  appName: SupportedApps;
  modelName: string;
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
  setFormModal: (modal: IFormModalObject) => void;
  setDeleteModal: (deleteModal: IDeleteModalState) => void;
  setIsDropdownUpward: React.Dispatch<
    React.SetStateAction<{
      id: string;
      visible: boolean;
    }>
  >;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
}) {
  const deleteSessionData = JSON.parse(
    sessionStorage.getItem("bulkDeleteData") || "{}"
  );

  const [extendedMenuVisible, setExtendedMenuVisible] =
    React.useState<IDeleteModalState>({
      visible: false,
      id: "",
    });

  let isLinkEnabled = true;
  if (
    !Object.keys(deleteSessionData)?.length ||
    !Object.keys(deleteSessionData?.[modelName] || {})?.length ||
    !data?.id
  ) {
    isLinkEnabled = true;
  } else {
    const idArray: string[] = [];
    for (const key in deleteSessionData?.[modelName]) {
      idArray.push(...deleteSessionData?.[modelName][key]);
    }
    isLinkEnabled = idArray.includes(data.id) ? false : true;
  }

  return (
    <ActionsMenuItems
      isLinkEnabled={isLinkEnabled}
      appName={appName}
      modelName={modelName}
      item={data}
      isDropdownUpward={isDropdownUpward}
      setIsDropdownUpward={setIsDropdownUpward}
      setExtendedMenuVisible={
        !isLinkEnabled ? (item) => {} : setExtendedMenuVisible
      }
      launchMenuVisible={extendedMenuVisible}
      onCreateCallLog={() => {
        setFormModal({
          visible: true,
          formDetails: {
            type: "Add",
            parentId: data["id"],
            parentModelName: modelName,
            id: null,
            modelName: "callLog",
            aliasName: "CallLog",
            appName: appName,
          },
        });
        setExtendedMenuVisible({
          visible: false,
          id: "",
        });
      }}
      onCreateTask={() => {
        setFormModal({
          visible: true,
          formDetails: {
            type: "Add",
            parentId: data["id"],
            parentModelName: modelName,
            id: null,
            modelName: "task",
            aliasName: "Task",
            appName: appName,
          },
        });
        setExtendedMenuVisible({
          visible: false,
          id: "",
        });
      }}
      onScheduleMeeting={() => {
        setFormModal({
          visible: true,
          formDetails: {
            type: "Add",
            parentId: data["id"],
            parentModelName: modelName,
            id: null,
            modelName: "meeting",
            aliasName: "Meeting",
            appName: appName,
          },
        });
        setExtendedMenuVisible({
          visible: false,
          id: "",
        });
      }}
      onCloneRecord={() => {
        router?.push(
          appsUrlGenerator(
            appName,
            modelName,
            AllowedViews.add,
            undefined,
            modelNameValuesWithSystemSubForm.includes(modelName)
              ? [
                  `?cloneId=${data.id}&&subform=${
                    modelNameMapperForParamURLGenerator(modelName)?.subForm
                  }&&dependingModule=product&&subformfield=${
                    modelNameMapperForParamURLGenerator(modelName)
                      ?.subFormFieldLinked
                  }`,
                ]
              : [`?cloneId=${data.id}`]
          )
        );
      }}
      onDeleteModel={() => {
        setDeleteModal({ visible: true, id: data["id"] });
        setExtendedMenuVisible({
          visible: false,
          id: "",
        });
      }}
      menuRenderFunc={(menuItem, index) => (
        <Button
          id="generic-module-action"
          key={index}
          customStyle=""
          userEventName="generic-module:action-click"
        >
          <div
            id={menuItem.label}
            onClick={(e) => {
              e.preventDefault();
              if (!isLinkEnabled) return;
              menuItem.onClick();
            }}
            className={`w-48 p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover ${menuItem.labelClasses}`}
          >
            <span>{menuItem.icon}</span>
            <span className="text-black truncate">{menuItem.label}</span>
          </div>
        </Button>
      )}
      currentModuleLabel={currentModuleLabel}
      navActivityModuleLabels={navActivityModuleLabels}
      salesOrderModuleLabel={salesOrderModuleLabel}
      invoiceModuleLabel={invoiceModuleLabel}
      setDisplayConversionModal={setDisplayConversionModal}
    />
  );
}
