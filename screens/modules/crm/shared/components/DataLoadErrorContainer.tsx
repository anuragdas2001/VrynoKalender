import React from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import RetryIcon from "remixicon-react/RestartLineIcon";

export type DataLoadErrorContainerProps = {
  modelName?: string;
  containerMessage?: string;
  onClick?: () => void;
  disabled?: boolean;
  showButton?: boolean;
  children?: React.ReactElement;
  loadingData?: boolean;
};

export const DataLoadErrorContainer = ({
  modelName,
  containerMessage,
  showButton = true,
  onClick = () => {},
  disabled = false,
  children,
  loadingData,
}: DataLoadErrorContainerProps) => {
  return (
    <div
      style={{
        height: (window.innerHeight * 3) / 6,
      }}
      className="w-full flex flex-col  items-center justify-center"
    >
      <div
        className={`${
          showButton ? "bg-white" : ""
        }  w-full max-w-xs max-h-64 flex flex-col items-center justify-center h-full rounded-xl p-6`}
      >
        <img src={"/error_visual.svg"} alt="Error Image" />
        <p
          className="font-medium w-full text-center mt-6 text-sm"
          style={{ color: "#535353" }}
        >
          {containerMessage
            ? containerMessage
            : `Oops! Looks like there is an error.`}
        </p>
        <>
          <div className="my-4 w-2/3">
            <Button
              id={`retry-${modelName}`}
              onClick={onClick}
              kind="primary"
              disabled={disabled || loadingData}
              loading={loadingData}
              userEventName={`${modelName}-dataLoad-retry-click`}
            >
              <span
                className={`col-span-8 sm:col-span-10 flex justify-center items-center pr-1`}
              >
                <RetryIcon size={20} className="mr-2" />
                <span>Retry Again</span>
              </span>
            </Button>
          </div>
        </>
        {children}
      </div>
    </div>
  );
};
export default DataLoadErrorContainer;
