import React, { RefObject } from "react";

export type ResultContainerProps = {
  children?: React.ReactElement;
  subChildren?: React.ReactElement;
  inputWidth: number;
  inputHeight: number;
  height?: number;
  lookupRef: RefObject<HTMLDivElement> | null;
  relatedTo?: boolean;
};

export const ResultContainer = ({
  children,
  subChildren,
  inputHeight,
  height,
  inputWidth,
  lookupRef,
  relatedTo = false,
}: ResultContainerProps) => {
  return (
    <div
      ref={lookupRef}
      style={{
        width: inputWidth,
        height: height,
        minHeight: inputHeight,
        maxHeight: inputHeight * 5,
        background: "white",
      }}
      className={`origin-top-right top-2 absolute z-10 `}
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
          maxHeight: subChildren ? inputHeight * 3 : inputHeight * 4,
          overflow: "auto",
          background: "white",
        }}
        className="rounded-t-md shadow-lg border border-b-0 border-vryno-form-border-gray"
      >
        {children}
      </div>
      {subChildren && (
        <div
          ref={lookupRef}
          style={{
            width: inputWidth,
            height: height,
            maxHeight: inputHeight * 2,
            overflow: "auto",
            background: "white",
          }}
          className="rounded-b-md shadow-lg border border-t-0 border-vryno-form-border-gray"
        >
          {subChildren}
        </div>
      )}
    </div>
  );
};
