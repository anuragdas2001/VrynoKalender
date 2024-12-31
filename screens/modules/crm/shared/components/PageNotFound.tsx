import React from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import GoBackIcon from "remixicon-react/ArrowLeftLineIcon";

export const PageNotFound = ({
  fullScreen = false,
  message,
  show404 = true,
}: {
  fullScreen?: boolean;
  message?: string;
  show404?: boolean;
}) => {
  return (
    <div
      style={{
        height: fullScreen ? "100vh" : (window.innerHeight * 5) / 6,
      }}
      className="w-full flex flex-col items-center justify-center rounded-xl p-6 "
    >
      <img src="/No_Data_Image.svg" alt="No Data Image" className="my-5" />
      {show404 && <img src="/404.svg" alt="404" className="my-5" />}
      <span>{`${
        message ? message : "Sorry, we could not find the page you requested"
      }`}</span>
      <div className="my-4 w-40">
        <Button
          id={`homepage`}
          onClick={() => window.history.back()}
          kind="primary"
          userEventName="pageNotFound-back-page-click"
        >
          <span
            className={`col-span-8 sm:col-span-10 flex justify-center items-center pr-1`}
          >
            <GoBackIcon size={20} className="mr-2" />
            <span>Go Back</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
