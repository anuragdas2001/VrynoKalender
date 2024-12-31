import React from "react";
import { ResultContainer } from "./ResultContainer";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import { IFormModalObject } from "./dynamicLookupHelpers";
import Button from "../Button/Button";

export function DataResultContainer({
  inputHeight,
  inputWidth,
  lookupRef,
  modelName,
  userModel,
  setPanelBelowVisible,
  setQuickCreateModal,
  appName,
  searchResults,
  handleSelectedItem,
  searchBy,
}: {
  inputHeight: number;
  inputWidth: number;
  lookupRef: React.RefObject<HTMLDivElement>;
  modelName: string;
  userModel: string;
  setPanelBelowVisible: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  setQuickCreateModal: (
    value:
      | ((prevState: IFormModalObject) => IFormModalObject)
      | IFormModalObject
  ) => void;
  appName: string;
  searchResults: Array<any>;
  handleSelectedItem: (item: any) => void;
  searchBy: Array<string>;
}) {
  return (
    <div className="relative inline-block">
      <ResultContainer
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        subChildren={
          modelName !== userModel ? (
            <Button
              id="result-container-modal-button"
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
              customStyle="w-full h-full flex items-center justify-center py-3.5 px-2 text-sm bg-vryno-table-background text-vryno-theme-light-blue cursor-pointer"
              userEventName="open-result-container-quick-create-modal-click"
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
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="w-full h-full py-3.5 px-2 text-sm bg-white truncate hover:bg-vryno-table-background cursor-pointer"
              onClick={() => {
                handleSelectedItem(result);
                setPanelBelowVisible(false);
              }}
            >
              {searchBy.map((item, index) => (
                <span key={index}>{result[item]}</span>
              ))}
            </div>
          ))}
        </>
      </ResultContainer>
    </div>
  );
}
