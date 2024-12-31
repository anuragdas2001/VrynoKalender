import React from "react";
import MoreInfo from "remixicon-react/QuestionFillIcon";
import Button from "../Form/Button/Button";

export type GenericFormContainerProps = {
  formHeading?: string;
  children?: React.ReactElement;
  infoArray?: Array<{ value: string; label: string }>;
};

export const GenericFormContainer = ({
  children,
  infoArray,
  formHeading,
}: GenericFormContainerProps) => {
  const [moreInfoVisible, setMoreInfoVisible] = React.useState(false);
  return (
    <div className="bg-white rounded-xl flex flex-col items-center shadow-lg pt-5.6 pb-7.5 px-6">
      <div className="w-full grid grid-cols-3 mb-3">
        <span className="font-bold col-span-2">{formHeading}</span>
        <div className="w-full flex flex-row justify-end col-span-1">
          <Button
            id="generic-form-show-more-info"
            onClick={() => setMoreInfoVisible(!moreInfoVisible)}
            customStyle=""
            userEventName="generic-form-showMore-info:toggle-click"
          >
            <MoreInfo className="text-vryno-icon-gray cursor-pointer" />
          </Button>
          {moreInfoVisible && (
            <div className="z-40 bg-white rounded-xl shadow-lg px-2 py-2 absolute mt-6 w-52">
              {infoArray &&
                infoArray.map((info, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-bold">{info.label}</span>
                    <span className="text-sm text-vryno-label-gray">
                      {info.value}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};
