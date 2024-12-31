import React, { useRef } from "react";
import Button from "../Form/Button/Button";
import CloseIcon from "remixicon-react/CloseLineIcon";
import ErrorWarningIcon from "remixicon-react/ErrorWarningFillIcon";
import { ClickOutsideToClose } from "../shared/ClickOutsideToClose";

export const NoPermissionComponent = ({
  setShowPermissionModal,
  fontSize,
}: {
  setShowPermissionModal: (value: boolean) => void;
  fontSize: string;
}) => (
  <span className={`text-vryno-danger ${fontSize}`}>
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPermissionModal(true);
      }}
      className="inline-block align-middle"
    >
      <ErrorWarningIcon size={14} className="text-vryno-warning-secondary" />
    </button>
  </span>
);

export default function PermissionModal({
  formHeading = "Permission",
  onCancel = () => {},
  type,
  recordIds,
  shortMessage,
}: {
  formHeading?: string;
  onCancel: () => void;
  type: "permission" | "noData" | null;
  recordIds: string | string[];
  shortMessage: boolean;
}) {
  const refCloseModal = useRef(null);
  ClickOutsideToClose(refCloseModal, (value: boolean) => onCancel());
  recordIds = Array.isArray(recordIds) ? recordIds.join(", ") : recordIds;
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
            userEventName="permissionModal-closeModal:action-click"
          >
            <CloseIcon className="cursor-pointer" color="#0080FE" />
          </Button>
        </div>

        <div className="text-sm">
          {type == "permission" ? (
            <>
              {!shortMessage ? (
                <p>
                  Data found with id:{" "}
                  <span className="font-medium">{recordIds || "-"}</span>
                </p>
              ) : (
                <></>
              )}
              <p>You do not have permission to view details.</p>
            </>
          ) : type === "noData" ? (
            <>
              {!shortMessage ? (
                <p>
                  Data found with id:{" "}
                  <span className="font-medium">{recordIds || "-"}</span>
                </p>
              ) : (
                <></>
              )}
              <p>
                Either the record has been deleted, or you do not have
                permission to view the record.
              </p>
            </>
          ) : (
            <p>Something unexpected happen. Please contact admin</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function NoDataForFieldPermissionModal({
  onCancel = () => {},
  type = "data",
  message = "",
}: {
  onCancel: () => void;
  type: "data" | "field";
  message: string;
}) {
  const refCloseModal = useRef(null);
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
            data-testid={`title-no-field-expression-data`}
          >
            {type === "data" ? "No data" : "Hidden field expression"}
          </span>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            id={`no-field-expression-data-modal-close`}
            customStyle=""
            userEventName="permissionModal-closeModal:action-click"
          >
            <CloseIcon className="cursor-pointer" color="#0080FE" />
          </Button>
        </div>

        <div className="text-sm">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
