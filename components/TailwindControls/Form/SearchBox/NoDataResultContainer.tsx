import React from "react";
import { ResultContainer } from "./ResultContainer";

export function NoDataResultContainer({
  appName,
  modelName,
  inputHeight,
  inputWidth,
  lookupRef,
  handleAddedRecord = () => {},
}: {
  appName: string;
  modelName: string;
  inputHeight: number;
  inputWidth: number;
  lookupRef: React.RefObject<HTMLDivElement> | null;
  handleAddedRecord?: (data: any) => void;
}) {
  return (
    <div className="relative inline-block">
      <ResultContainer
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        handleAddedRecord={(data) => handleAddedRecord(data)}
      >
        <div className="w-full h-full py-2 text-sm flex items-center justify-center bg-white text-gray-500">
          <span>No Data Found</span>
        </div>
      </ResultContainer>
    </div>
  );
}
