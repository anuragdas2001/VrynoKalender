import React from "react";
import { ResultContainer } from "./ResultContainer";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import { IFormModalObject } from "./dynamicLookupHelpers";
import Button from "../Button/Button";

export function NoDataResultContainer({
  inputHeight,
  inputWidth,
  lookupRef,
  modelName,
  setPanelBelowVisible,
  setQuickCreateModal,
  appName,
}: {
  inputHeight: number;
  inputWidth: number;
  lookupRef: React.RefObject<HTMLDivElement>;
  modelName: string;
  setPanelBelowVisible: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  setQuickCreateModal: (
    value:
      | ((prevState: IFormModalObject) => IFormModalObject)
      | IFormModalObject
  ) => void;
  appName: string;
}) {
  return (
    <div className="relative inline-block">
      <ResultContainer
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        subChildren={
          modelName !== "User" ? (
            <Button
              id="no-data-result-container-modal-button"
              onClick={() => {
                setPanelBelowVisible(false);
                setQuickCreateModal({
                  visible: true,
                  formDetails: {
                    type: "Add",
                    id: null,
                    modelName: modelName,
                    appName: appName,
                    quickCreate: true,
                  },
                });
              }}
              customStyle="w-full h-full flex items-center justify-center py-3.5 px-2 text-sm bg-vryno-table-background text-vryno-theme-light-blue  cursor-pointer"
              userEventName="open-noData-result-container-quick-create-modal-click"
            >
              <>
                <CircleIcon size={20} className="mr-2" />
                <span>{`Add ${modelName}`}</span>
              </>
            </Button>
          ) : (
            <div />
          )
        }
      >
        <>
          <div className="w-full h-full py-3.5 text-sm flex items-center justify-center bg-white text-gray-500">
            <span>No Data Found</span>
          </div>
        </>
      </ResultContainer>
    </div>
  );
}
