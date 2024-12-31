import React, { useRef } from "react";
import Button from "../Form/Button/Button";
import { ClickOutsideToClose } from "../shared/ClickOutsideToClose";

export type DeleteModalTypes = {
  id: string | null | undefined;
  modalHeader: string;
  modalMessage: string;
  leftButton?: string;
  rightButton?: string;
  loading: boolean;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
  onOutsideClick?: (value: boolean) => void;
};

export default function DeleteModal({
  id,
  modalHeader,
  modalMessage,
  leftButton = "Cancel",
  rightButton = "Delete",
  loading,
  onCancel = () => {},
  onDelete = () => {},
  onOutsideClick = () => {},
}: DeleteModalTypes) {
  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value) => onOutsideClick(value));

  return (
    <div className="w-screen h-screen z-[2000] fixed top-0 left-0 flex items-center justify-center">
      <div
        className="rounded-xl shadow-lg py-9 px-7 bg-white mx-5 flex flex-col items-center"
        ref={wrapperRef}
      >
        <span className="font-semibold text-lg mb-2.5">{modalHeader}</span>
        <span className="text-sm">{modalMessage}</span>
        <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
          <Button
            id={`confirm-${leftButton.toLowerCase()}`}
            onClick={onCancel}
            type={"submit"}
            kind="back"
            disabled={loading}
            userEventName="delete-modal:cancel-click"
          >
            <span>{leftButton}</span>
          </Button>
          <Button
            id={`confirm-${rightButton.toLowerCase()}`}
            onClick={() => (id ? onDelete(id) : {})}
            type="submit"
            kind="primary"
            autoFocus={true}
            disabled={loading}
            loading={loading}
            userEventName="delete-modal:submit-click"
          >
            <span>{rightButton}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
