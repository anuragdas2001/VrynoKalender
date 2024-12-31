import React, { useRef } from "react";
import Button from "../Form/Button/Button";
import { ClickOutsideToClose } from "../shared/ClickOutsideToClose";

export type GenericModalTypes = {
  id?: string;
  modalHeader: string;
  modalMessage: string;
  leftButton: string;
  rightButton: string;
  loading: boolean;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
  onOutsideClick?: (value: boolean) => void;
};

export default function GenericModal({
  id,
  modalHeader,
  modalMessage,
  leftButton,
  rightButton,
  loading,
  onCancel = () => {},
  onDelete,
  onOutsideClick = () => {},
}: GenericModalTypes) {
  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value: boolean) => onOutsideClick(value));

  return (
    <>
      <div
        className="w-full grid sm:grid-cols-10 md:grid-cols-12 fixed top-0 z-30"
        style={{ minHeight: "inherit" }}
      >
        <div className="sm:grid sm:col-span-2 md:col-span-4"></div>
        <div className="w-full h-full flex flex-col justify-center sm:col-span-6 md:col-span-4 px-4">
          <div
            className="bg-white rounded-xl flex flex-col items-center shadow-lg py-9 px-7"
            ref={wrapperRef}
          >
            <span className="font-semibold text-lg mb-2.5">{modalHeader}</span>
            <span className="text-sm">{modalMessage}</span>
            <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
              <Button
                id={leftButton}
                onClick={onCancel}
                type={"submit"}
                kind="back"
                userEventName="generic-modal:cancel-click"
              >
                <span>{leftButton}</span>
              </Button>
              <Button
                id={rightButton}
                onClick={() =>
                  onDelete && id
                    ? onDelete(id)
                    : console.error("On Delete not defined or id is null")
                }
                type={"submit"}
                kind="primary"
                loading={loading}
                userEventName="generic-modal:submit-click"
              >
                <span>{rightButton}</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="sm:grid sm:col-span-2 md:col-span-4"></div>
      </div>
    </>
  );
}
