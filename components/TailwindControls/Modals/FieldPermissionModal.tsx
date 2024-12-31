import React from "react";
import Button from "../Form/Button/Button";
import CloseIcon from "remixicon-react/CloseLineIcon";
import { ClickOutsideToClose } from "../shared/ClickOutsideToClose";

export const FieldPermissionModal = ({
  onCancel = () => {},
  formHeading = "Field Permission",
  fieldsNameArray,
}: {
  onCancel: () => void;
  formHeading?: string;
  fieldsNameArray: string[];
}) => {
  const refCloseModal = React.useRef(null);
  ClickOutsideToClose(refCloseModal, (value: boolean) => onCancel());

  return (
    <div
      className={`w-full h-screen fixed top-0 left-0 flex items-center justify-center:max-w-3xl z-[2002] py-8`}
    >
      <div
        className={`rounded-xl shadow-lg bg-white px-5 py-6 mx-5 sm:mx-auto max-h-full text-black overflow-y-scroll max-w-[90%]`}
        ref={refCloseModal}
      >
        <div
          className={`flex flex-row items-center justify-between w-full h-full mb-4`}
        >
          <span
            className="font-medium text-lg"
            data-testid={`title-${formHeading}`}
          >
            {formHeading}
          </span>
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
            userEventName="fieldPermissionModal-closeModal:action-click"
          >
            <CloseIcon className="cursor-pointer" color="#0080FE" />
          </Button>
        </div>

        <div className="text-sm">
          {true ? (
            <>
              <p>
                You do not have permission to view:{" "}
                <span className="font-medium">
                  {fieldsNameArray?.toString() || "-"}
                </span>
              </p>
            </>
          ) : (
            <p>Something unexpected happen. Please contact admin</p>
          )}
        </div>
      </div>
    </div>
  );
};
