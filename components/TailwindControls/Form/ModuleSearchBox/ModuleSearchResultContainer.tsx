import React, { RefObject } from "react";

export type ModuleSearchResultContainerProps = {
  children?: React.ReactElement;
  inputWidth: number;
  inputHeight: number;
  lookupRef: RefObject<HTMLDivElement> | null;
};

export const ModuleSearchResultContainer = ({
  children,
  inputHeight,
  inputWidth,
  lookupRef,
}: ModuleSearchResultContainerProps) => {
  return (
    <div
      ref={lookupRef}
      style={{
        width: inputWidth,
        height: inputHeight * 8,
        minHeight: inputHeight,
        background: "white",
      }}
      role="menu"
      id="moreInfo"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      <div
        ref={lookupRef}
        style={{
          width: inputWidth,
          height: inputHeight * 8,
          background: "white",
        }}
        className={`border border-t-0 border-vryno-form-border-gray rounded-b-md p-2`}
      >
        {children}
      </div>
    </div>
  );
};
