import React from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import UserAddIcon from "remixicon-react/UserAddLineIcon";
import { sentenceCase } from "change-case";

export type NoDataFoundContainerProps = {
  modelName?: string;
  moduleLabel?: string;
  containerMessage?: string;
  onClick?: () => void;
  disabled?: boolean;
  showButton?: boolean;
  children?: React.ReactElement;
  messageType?: "data" | "view";
};

export const NoDataFoundContainer = ({
  modelName,
  moduleLabel,
  containerMessage,
  showButton = true,
  onClick = () => {},
  disabled = false,
  children,
  messageType = "data",
}: NoDataFoundContainerProps) => {
  return (
    <div
      style={{
        height: (window.innerHeight * 4) / 6,
      }}
      className="w-full flex flex-col  items-center justify-center"
    >
      <div
        className={`w-full max-w-xs max-h-64 flex flex-col items-center justify-center h-full rounded-xl p-6 ${
          showButton ? "bg-white" : ""
        }`}
      >
        <p className="font-medium w-full text-center">
          {containerMessage
            ? containerMessage
            : `No ${
                moduleLabel
                  ? moduleLabel
                  : modelName
                  ? sentenceCase(modelName)
                  : "Data"
              } ${messageType == "data" ? "at this moment." : "in this view."}`}
        </p>
        {showButton && (
          <>
            <UserAddIcon className="text-vryno-theme-blue my-2" size={40} />
            <div className="my-4 w-2/3">
              <Button
                id={`add-${modelName}-no-data-found`}
                onClick={onClick}
                kind="primary"
                disabled={disabled}
                userEventName={`${modelName}-noData-add-record-click`}
              >
                <span
                  className={`col-span-8 sm:col-span-10 flex justify-center items-center pr-1`}
                >
                  <CircleIcon size={20} className="mr-2" />
                  <span>Create New</span>
                </span>
              </Button>
            </div>
          </>
        )}
        {children}
      </div>
    </div>
  );
};
export default NoDataFoundContainer;
