import React from "react";
import Button from "../Button/Button";
import CloseIcon from "remixicon-react/CloseLineIcon";
import { FormikValues, useFormikContext } from "formik";
import EmailAttachments from "./EmailAttachments";

export type AttachmenntContainerProps = {
  modelName?: string;
  editMode: boolean;
  allowFileAttachments: boolean;
  editModeFiles: {
    name: string;
    fileId: string;
  }[];
  fileUpload: {
    name: string;
    fileId: string;
  }[];
  disabled?: boolean;
  setEditModeFiles: (
    values: {
      name: string;
      fileId: string;
    }[]
  ) => void;
  setFileUpload: (
    values: {
      name: string;
      fileId: string;
    }[]
  ) => void;
};

export const AttachmentContainer = ({
  modelName,
  editMode,
  allowFileAttachments,
  editModeFiles,
  fileUpload,
  disabled,
  setEditModeFiles,
  setFileUpload,
}: AttachmenntContainerProps) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  return (
    <div
      className={`flex flex-row items-center gap-x-4 px-6 my-4 ${
        allowFileAttachments ? "" : "hidden"
      }`}
    >
      <span>Attachments</span>
      <div className="">
        {[...editModeFiles, ...fileUpload]?.length > 0 &&
          [...editModeFiles, ...fileUpload]?.map((value, index) => (
            <span
              className={`bg-vryno-theme-highlighter-blue hover:text-white hover:bg-vryno-theme-light-blue px-2 rounded-xl mr-2 inline-flex justify-center items-center my-1 text-xs`}
              key={index}
            >
              <span className="pl-1">{`${value?.name}`}</span>
              <Button
                id="multiple-values-dropdown-close"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const findIndexInEditModeFiles = editModeFiles?.findIndex(
                    (editModeFile) => editModeFile.fileId === value.fileId
                  );
                  const findIndexInFileUploaded = fileUpload?.findIndex(
                    (file) => file.fileId === value.fileId
                  );
                  if (findIndexInEditModeFiles !== -1)
                    setEditModeFiles(
                      editModeFiles?.filter(
                        (file) =>
                          file.fileId !==
                          editModeFiles[findIndexInEditModeFiles].fileId
                      )
                    );
                  if (findIndexInFileUploaded !== -1)
                    setFileUpload(
                      fileUpload?.filter(
                        (file) =>
                          file.fileId !==
                          fileUpload[findIndexInFileUploaded].fileId
                      )
                    );
                  setFieldValue(
                    "attachmentFileKeys",
                    values["attachmentFileKeys"]?.filter(
                      (data: any) => data !== value.fileId
                    )
                  );
                }}
                customStyle=""
                userEventName="multiple-values-dropdown-close:action-click"
              >
                <CloseIcon className="ml-2 w-4 cursor-pointer hover:text-red-500" />
              </Button>
            </span>
          ))}
      </div>
      <EmailAttachments
        name="attachmentFileKeys"
        modelNameToBeUsed={modelName}
        allowMultiple={true}
        editModeFiles={editModeFiles}
        fileUpload={fileUpload}
        editMode={editMode}
        disabled={disabled}
        allowFileAttachments={allowFileAttachments}
        setEditModeFiles={(value) => setEditModeFiles(value)}
        setFileUpload={(value) => setFileUpload(value)}
      />
    </div>
  );
};
