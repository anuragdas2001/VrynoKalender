import React from "react";
import { useFormikContext } from "formik";
import { toast } from "react-toastify";
import { Config } from "../../../../shared/constants";
import AttachmentIcon from "remixicon-react/Attachment2Icon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { cookieUserStore } from "../../../../shared/CookieUserStore";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import { getAppPathParts } from "../../../../screens/modules/crm/shared/utils/getAppPathParts";
import { Loading } from "../../Loading/Loading";
import Button from "../Button/Button";
import { FormFilePickerProps, fileOnInput } from "./filePickerHelpers";

export default function FormFilePicker({
  name,
  label,
  helpText,
  isSample = false,
  disabled = false,
  labelLocation = SupportedLabelLocations.OnTop,
  editMode = false,
  allowMultiple = true,
  clearFiles,
  handleClearState,
  maxFileSize = 5097152,
  modelNameToBeUsed,
  addFileNameToField = false,
  setDisabled = undefined,
  removedNameValue = null,
}: FormFilePickerProps) {
  const { modelName: pathModel } = getAppPathParts();
  const modelName = modelNameToBeUsed || pathModel;
  const { values, touched, setFieldValue, errors } =
    useFormikContext<Record<string, any>>();
  const [fileProcessing, setFileProcessing] = React.useState(false);
  const [editModeFiles, setEditModeFiles] = React.useState<
    { name: string; fileId: string }[]
  >([]);
  const [fileUpload, setFileUpload] = React.useState<
    { name: string; fileId: string }[]
  >([]);
  let isValid = touched[name] ? errors[name] === undefined : true;

  function uploadSingleFile(currentFile: File, fileId: string) {
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
    } else {
      setFieldValue(name, fileId);
    }
  }
  function deleteFile(
    item: Record<string, string>,
    removedNameValue: string | null
  ) {
    if (allowMultiple) {
      const remainingFiles = fileUpload.filter(
        (file) => file.fileId !== item.fileId
      );
      setFileUpload(remainingFiles);
      const editValue = editModeFiles.map((file) => {
        return file.fileId;
      });
      const remainingValue = remainingFiles.map((file) => {
        return file.fileId;
      });
      setFieldValue(name, [...editValue, ...remainingValue]);
    } else {
      setFieldValue(name, removedNameValue === "" ? "" : removedNameValue);
      setFileUpload([]);
    }
  }
  function deleteEditModeFile(
    item: Record<string, string>,
    removedNameValue: string | null
  ) {
    if (allowMultiple) {
      const remainingFiles = editModeFiles.filter(
        (file) => file.fileId !== item.fileId
      );
      setEditModeFiles(remainingFiles);
      const remainingValue = remainingFiles.map((file) => {
        return file.fileId;
      });
      const editValue = fileUpload.map((file) => {
        return file.fileId;
      });
      setFieldValue(name, [...remainingValue, ...editValue]);
    } else {
      setFieldValue(name, removedNameValue === "" ? "" : removedNameValue);
      setEditModeFiles([]);
    }
  }
  React.useEffect(() => {
    if (clearFiles) {
      setFileUpload([]);
      setFieldValue(name, undefined);
      setEditModeFiles([]);
    }
    if (handleClearState) {
      handleClearState(false);
    }
  }, [clearFiles]);
  React.useEffect(() => {
    if (values[name] && editMode) {
      fetch(
        `${Config.metaPrivateUploadUrl()}crm/${modelName}/${values[name]}.json`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.fileInfo?.id)
            setEditModeFiles([
              {
                name: data?.fileInfo?.fileName,
                fileId: data?.fileInfo?.id,
              },
            ]);
        });
    } else {
      setEditModeFiles([]);
    }
  }, [editMode, values[name]]);
  React.useEffect(() => {
    if (addFileNameToField && fileUpload.length) {
      setFieldValue("fileName", fileUpload[0].name);
    }
  }, [fileUpload]);
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  return (
    <div className={`flex my-4 items-center justify-center ${divFlexCol}`}>
      {editModeFiles.length > 0 &&
        editModeFiles.map((item, index) => {
          if (item.fileId) {
            return (
              <div
                key={index}
                className="w-full grid grid-cols-12 bg-gray-300 bg-opacity-30 rounded-md p-2 mb-2"
              >
                <span className="col-span-10 truncate text-sm">
                  {item.name}
                </span>
                <Button
                  id="form-file-picker-edit-close"
                  onClick={() => deleteEditModeFile(item, removedNameValue)}
                  customStyle="col-span-2 flex justify-end items-center"
                  userEventName="formFilePicker-edit-close:action-click"
                >
                  <CloseLineIcon
                    size={24}
                    className="text-black cursor-pointer"
                  />
                </Button>
              </div>
            );
          }
        })}
      {fileUpload.length > 0 &&
        !editMode &&
        fileUpload.map((item, index) => {
          if (item.fileId) {
            return (
              <div
                key={index}
                className="w-full grid grid-cols-12 bg-gray-300 bg-opacity-30 rounded-md p-2 mb-2"
                title={item.name}
              >
                <span className="col-span-10 truncate text-xs">
                  {item.name}
                </span>
                <Button
                  id="form-file-picker-close"
                  onClick={() => deleteFile(item, removedNameValue)}
                  customStyle="col-span-2 flex justify-end items-center"
                  userEventName="formFilePicker-close:action-click"
                >
                  <CloseLineIcon
                    size={16}
                    className="text-black cursor-pointer"
                  />
                </Button>
              </div>
            );
          }
        })}
      <div className="flex gap-x-6 items-center">
        {label && (
          <div className="flex flex-col" data-testid={`attachment-uploader`}>
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
                className={`${
                  fileProcessing ? "text-gray-300" : "text-gray-400"
                }`}
              />
              {allowMultiple ? "Attach Files" : "Upload File"}
            </label>
          </div>
        )}
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
      {helpText}
      {!isValid && errors[name] && (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          <>{errors[name]}</>
        </label>
      )}
    </div>
  );
}
