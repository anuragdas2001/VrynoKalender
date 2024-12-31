import React, { RefObject, useContext } from "react";
import { getNavigationLabel } from "../../../../screens/modules/crm/shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../../../stores/RootStore/NavigationStore/NavigationStore";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import GenericFormModalWrapper from "../../Modals/FormModal/ActivityFormModals/GenericFormModalWrapper";
import { Backdrop } from "../../Backdrop";
import { AccountModels } from "../../../../models/Accounts";
import { IFormModalObject } from "./SearchBoxProps";
import Button from "../Button/Button";

const emptyModalValues = {
  visible: false,
  formDetails: {
    type: null,
    id: null,
    modelName: "",
    appName: "",
    quickCreate: false,
    aliasName: "",
    parentid: "",
  },
};

export type ResultContainerProps = {
  appName: string;
  modelName: string;
  children?: React.ReactElement;
  subChildren?: React.ReactElement;
  inputWidth: number;
  inputHeight: number;
  height?: number;
  lookupRef: RefObject<HTMLDivElement> | null;
  relatedTo?: boolean;
  overflow?: boolean;
  handleAddedRecord?: (data: any) => void;
  setCurrentFormLayer?: (value: boolean) => void;
  setPanelBelowVisible?: (value: boolean) => void;
};

export const ResultContainer = ({
  appName,
  modelName,
  children,
  subChildren,
  inputHeight,
  height,
  inputWidth,
  lookupRef,
  overflow,
  handleAddedRecord = () => {},
  setCurrentFormLayer = () => {},
  relatedTo = false,
  setPanelBelowVisible = () => {},
}: ResultContainerProps) => {
  const { navigations } = useContext(NavigationStoreContext);
  const [formModal, setFormModal] = React.useState<IFormModalObject>({
    visible: false,
    formDetails: {
      type: null,
      id: null,
      modelName: "",
      appName: "",
      quickCreate: false,
      aliasName: "",
    },
  });

  const currentModuleLabel = getNavigationLabel({
    navigations: navigations,
    currentModuleName: modelName,
    currentModuleLabel: modelName,
    defaultLabel: modelName,
  });

  return (
    <div
      ref={lookupRef}
      style={{
        width: inputWidth,
        height: height,
        minHeight: inputHeight,
        maxHeight: inputHeight * 6,
        background: "white",
      }}
      className={`${
        overflow ? "pt-1" : "origin-top-right top-1 absolute z-[100]"
      } `}
      role="menu"
      id="moreInfo"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      <div
        ref={lookupRef}
        style={{
          width: inputWidth,
          height: height,
          maxHeight: inputHeight * 4,
          overflow: "auto",
          background: "white",
        }}
        className={`rounded-t-md  shadow-lg border border-vryno-form-border-gray ${
          subChildren ? "border-b-0" : "rounded-b-md"
        }`}
      >
        {children}
      </div>
      <div
        className={`grid ${
          modelName &&
          modelName !== "dealPipelineStage" &&
          modelName !== "dealPipeline"
            ? "grid-cols-2"
            : ""
        }`}
      >
        <div
          ref={lookupRef}
          style={{
            width:
              subChildren &&
              modelName &&
              modelName !== AccountModels.User &&
              modelName !== "dealPipelineStage" &&
              modelName !== "dealPipeline"
                ? inputWidth / 2
                : inputWidth,
            height: height,
            maxHeight: inputHeight,
            overflow: "auto",
            background: "white",
          }}
          className={`rounded-b-md shadow-lg border border-vryno-form-border-gray ${
            modelName &&
            modelName !== AccountModels.User &&
            modelName !== "dealPipelineStage" &&
            modelName !== "dealPipeline"
              ? ""
              : "hidden"
          }`}
        >
          <Button
            id={`local-search-add-${modelName}-record`}
            onClick={() => {
              setFormModal({
                visible: true,
                formDetails: {
                  type: "Add",
                  id: null,
                  modelName: modelName,
                  appName: appName,
                  quickCreate: true,
                  aliasName: currentModuleLabel,
                },
              });
              setCurrentFormLayer(false);
            }}
            customStyle="w-full h-full flex items-center justify-center py-2 px-2 text-sm bg-vryno-table-background text-vryno-theme-light-blue cursor-pointer"
            userEventName={`local-search-add-${modelName}-record:action-click`}
            renderChildrenOnly={true}
          >
            <>
              <CircleIcon size={20} className="mr-1" />
              <span className={`flex truncate`}>{currentModuleLabel}</span>
            </>
          </Button>
        </div>
        <div
          ref={lookupRef}
          style={{
            width:
              subChildren &&
              modelName &&
              modelName !== "dealPipelineStage" &&
              modelName !== "dealPipeline"
                ? inputWidth / 2
                : inputWidth,
            height: height,
            maxHeight: inputHeight,
            overflow: "auto",
            background: "white",
          }}
          className={`rounded-b-md shadow-lg border  border-vryno-form-border-gray ${
            subChildren ? "" : "hidden"
          }`}
        >
          {subChildren}
        </div>
      </div>
      {formModal.visible && (
        <>
          <GenericFormModalWrapper
            onCancel={() => {
              setCurrentFormLayer(true);
              setFormModal(emptyModalValues);
              setPanelBelowVisible(false);
            }}
            formDetails={formModal.formDetails}
            onOutsideClick={() => {
              setCurrentFormLayer(true);
              setFormModal(emptyModalValues);
              setPanelBelowVisible(false);
            }}
            stopRouting={true}
            passedId={""}
            handleAddedRecord={(data) => {
              setCurrentFormLayer(true);
              handleAddedRecord(data);
            }}
          />
          <Backdrop
            onClick={() => {
              setCurrentFormLayer(true);
              setFormModal(emptyModalValues);
              setPanelBelowVisible(false);
            }}
          />
        </>
      )}
    </div>
  );
};
