import React, { useRef } from "react";
import { ClickOutsideToClose } from "../../shared/ClickOutsideToClose";
import MoreInfo from "remixicon-react/QuestionFillIcon";
import CloseIcon from "remixicon-react/CloseLineIcon";
import Button from "../../Form/Button/Button";

export type GenericFormModalContainerTypes = {
  topIconType?: "MoreInfo" | "Close" | "None";
  formHeading?: string;
  formSubHeading?: string;
  additionalInfo?: string;
  onCancel?: () => void;
  onOutsideClick?: (value: boolean) => void;
  children: React.ReactElement;
  infoArray?: Array<{ value: string; label: string }>;
  renderFullPage?: boolean;
  limitWidth?: boolean;
  extendedWidth?: boolean;
  maxWidth?: boolean;
  fullScreen?: boolean;
  allowScrollbar?: boolean;
  marginBottom?: string;
  useModalFormInUrl?: boolean;
  customWidth?: string;
};

export default function GenericFormModalContainer({
  topIconType = "Close",
  formHeading,
  formSubHeading,
  additionalInfo,
  onCancel = () => {},
  onOutsideClick = () => {},
  infoArray,
  children,
  renderFullPage = false,
  limitWidth = false,
  extendedWidth = false,
  fullScreen = false,
  maxWidth = false,
  allowScrollbar = true,
  marginBottom = "mb-0",
  useModalFormInUrl = true,
  customWidth,
}: GenericFormModalContainerTypes) {
  const refCloseModal = useRef(null);
  const refCloseMoreInfo = useRef(null);
  ClickOutsideToClose(refCloseModal, (value: boolean) => onOutsideClick(value));
  ClickOutsideToClose(refCloseMoreInfo, (value: boolean) =>
    setMoreInfoVisible(value)
  );

  const [moreInfoVisible, setMoreInfoVisible] = React.useState(false);
  return (
    <div
      className={`w-screen h-screen fixed top-0 left-0 flex items-center justify-center ${
        useModalFormInUrl ? "pb-32 sm:pb-5 pt-20 md:pt-20" : "py-8"
      } ${renderFullPage ? "" : "z-[2010]"}`}
    >
      <div
        className={`rounded-xl shadow-lg bg-white px-5 py-6 mx-5 sm:mx-auto max-h-full ${
          customWidth
            ? `w-full ${customWidth}`
            : limitWidth
            ? "w-full max-w-[450px]"
            : extendedWidth
            ? "w-full max-w-3xl"
            : maxWidth
            ? "w-full max-w-4xl"
            : "w-full max-w-xl md:max-w-2xl 2xl:max-w-3xl"
        } ${allowScrollbar && "overflow-y-scroll"}`}
        ref={refCloseModal}
      >
        <div
          className={`flex flex-row items-center justify-between w-full h-full mb-4 ${marginBottom}`}
        >
          <div className="flex flex-col gap-x-2">
            <span
              className="font-medium text-lg"
              data-testid={`title-${formHeading}`}
            >
              {formHeading}
            </span>
            <span
              className="font-medium text-sm text-gray-400"
              data-testid={`subtitle-${formSubHeading}`}
            >
              {formSubHeading}
            </span>
            <span
              className="text-sm text-vryno-theme-light-blue"
              data-testid={`additional-${additionalInfo}`}
            >
              {additionalInfo}
            </span>
          </div>
          {topIconType === "MoreInfo" ? (
            <div className="relative inline-block">
              <Button
                id="generic-form-modal-show-more-info"
                onClick={() => setMoreInfoVisible(true)}
                customStyle=""
                userEventName="genericFormModal-showMoreInfo:toggle-click"
              >
                <MoreInfo className="text-vryno-icon-gray cursor-pointer" />
              </Button>
              {moreInfoVisible && (
                <div
                  className="origin-top-right absolute right-0 z-40 p-2 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  id="moreInfo"
                  ref={refCloseMoreInfo}
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  {infoArray &&
                    infoArray.map((info, index) => (
                      <div key={index} className="mb-2">
                        <span className="text-sm font-bold block">
                          {info.label}
                        </span>
                        <span className="text-xs text-vryno-label-gray">
                          {info.value}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : topIconType === "Close" ? (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCancel();
              }}
              id={`${
                formHeading?.length
                  ? formHeading?.toLowerCase().split(" ").join("-")
                  : "card"
              }-modal-close`}
              customStyle=""
              userEventName="generic-form-container-close:action-click"
            >
              <CloseIcon className="cursor-pointer" color="#0080FE" />
            </Button>
          ) : (
            <></>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
