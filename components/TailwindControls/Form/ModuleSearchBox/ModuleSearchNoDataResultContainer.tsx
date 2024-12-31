import React from "react";
import { ModuleSearchResultContainer } from "./ModuleSearchResultContainer";

export function ModuleSearchNoDataResultContainer({
  inputHeight,
  inputWidth,
  lookupRef,
}: {
  inputHeight: number;
  inputWidth: number;
  lookupRef: React.RefObject<HTMLDivElement> | null;
}) {
  return (
    <div className="relative inline-block">
      <ModuleSearchResultContainer
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
      >
        <div className="w-full h-full py-2 text-sm flex items-center justify-center bg-white text-gray-500">
          <span>No Data Found</span>
        </div>
      </ModuleSearchResultContainer>
    </div>
  );
}
