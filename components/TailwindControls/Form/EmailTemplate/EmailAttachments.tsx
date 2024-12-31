import React from "react";
import { useFormikContext } from "formik";
import { toast } from "react-toastify";
import { Config } from "../../../../shared/constants";
import { imageUploadHandler } from "../../../../screens/modules/crm/shared/utils/imageUploadHandler";
import AttachmentIcon from "remixicon-react/Attachment2Icon";
import { cookieUserStore } from "../../../../shared/CookieUserStore";
import { paramCase } from "change-case";
import { getAppPathParts } from "../../../../screens/modules/crm/shared/utils/getAppPathParts";
import { Loading } from "../../Loading/Loading";

export type LocalImage = {
  lastModified: number;
  lastModifiedDate?: {};
  name: string;
  size: number;
  type: string;
  webkitRelativePath?: string;
};

function fileOnInput(
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  name: string,
  setFileProcessing: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void,
  modelName: string,
  uploadSingleFile: (currentFile: File, fileId: string) => void,
  setDisabled: any
) {
  return async (event: any) => {
    const currentFile =
      event.currentTarget.files && event.currentTarget.files.length
        ? event.currentTarget.files[0]
        : null;
    if (!currentFile) {
      return;
    }
    if (currentFile.type === "" || /zip|exe|json/.test(currentFile.type)) {
      toast.error("Cannot upload this file type");
      setFieldValue(name, null);
    } else if (currentFile.size > 2097152) {
      toast.error("Max file size can only be 2MB.");
      setFieldValue(name, null);
    } else {
      setFileProcessing(true);
      if (setDisabled) setDisabled(true);
      setFieldValue(name, null);
      const fileId = await imageUploadHandler({
        image: currentFile,
        serviceName: modelName === "moduleTemplate" ? "crm" : "notify",
        moduleName: modelName,
        publicUrl: false,
      });
      setFileProcessing(false);
      if (setDisabled) setDisabled(false);
      if (fileId) uploadSingleFile(currentFile, fileId);
    }
  };
}

export type EmailAttachmentsProps = {
  name: string;
  editMode?: boolean;
  allowMultiple?: boolean;
  maxFileSize?: number;
  modelNameToBeUsed?: string;
  setDisabled?: any;
  disabled?: boolean;
  editModeFiles: { name: string; fileId: string }[];
  fileUpload: { name: string; fileId: string }[];
  allowFileAttachments: boolean;
  setEditModeFiles: (value: { name: string; fileId: string }[]) => void;
  setFileUpload: (value: { name: string; fileId: string }[]) => void;
};

export default function EmailAttachments({
  name,
  editMode = false,
  allowMultiple = true,
  maxFileSize = 5097152,
  modelNameToBeUsed,
  disabled,
  setDisabled = undefined,
  editModeFiles,
  fileUpload,
  allowFileAttachments,
  setEditModeFiles,
  setFileUpload,
}: EmailAttachmentsProps) {
  const { modelName: pathModel } = getAppPathParts();
  const modelName = modelNameToBeUsed || pathModel;
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();
  const [fileProcessing, setFileProcessing] = React.useState(false);

  const uploadSingleFile = (currentFile: File, fileId: string) => {
    if (currentFile && currentFile.size > maxFileSize) {
      toast.error("Max file size can only be 5MB.");
      setFieldValue(name, null);
      return;
    }
    if (allowMultiple) {
      setFileUpload([
        ...fileUpload,
        { name: currentFile.name, fileId: fileId },
      ]);
    } else {
      setFileUpload([{ name: currentFile.name, fileId: fileId }]);
    }
    if (values[name] && allowMultiple) {
      setFieldValue(name, [...values[name], fileId]);
    } else if (!values[name] && allowMultiple) {
      setFieldValue(name, [fileId]);
    } else {
      setFieldValue(name, fileId);
    }
  };

  React.useEffect(() => {
    if (values[name] && editMode && modelName) {
      const fetchPromise = values[name].map(async (value: string) => {
        const response = await fetch(
          `${Config.metaPrivateUploadUrl()}${
            modelName === "moduleTemplate" ? "crm" : "notify"
          }/${modelName}/${value}.json`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
            },
          }
        );
        return response.json();
      });
      Promise.all(fetchPromise).then((result: any) => {
        let updatedAttachments: any[] = [];
        for (const res of result) {
          updatedAttachments = [
            ...updatedAttachments,
            {
              name: res?.fileInfo?.fileName,
              fileId: res?.fileInfo?.id,
            },
          ];
        }
        setEditModeFiles(updatedAttachments);
      });
    } else {
      setEditModeFiles([]);
    }
  }, []);

  return (
    <div
      className={`${
        allowFileAttachments ? "" : "hidden"
      } flex items-center justify-center`}
    >
      <div className="flex gap-x-6 items-center">
        <div className="flex flex-col" id={"attachment-upload-button"}>
          <label
            htmlFor={paramCase(name)}
            className={`w-full text-xs tracking-wide flex items-center overflow-hidden ${
              fileProcessing
                ? "text-gray-400"
                : "text-vryno-label-gray cursor-pointer"
            }`}
          >
            <AttachmentIcon
              size={20}
              className={`${disabled ? "" : "hover:text-blue-500"}  ${
                fileProcessing ? "text-gray-300" : "text-gray-400"
              }`}
            />
          </label>
        </div>
        {fileProcessing && (
          <div>
            <Loading color="Blue" />
          </div>
        )}
      </div>
      <div className="relative">
        <input
          id={paramCase(name)}
          name={name}
          type="file"
          onInput={fileOnInput(
            setFieldValue,
            name,
            setFileProcessing,
            modelName,
            uploadSingleFile,
            setDisabled
          )}
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          disabled={fileProcessing || disabled}
          className={`hidden`}
        />
      </div>
    </div>
  );
}
