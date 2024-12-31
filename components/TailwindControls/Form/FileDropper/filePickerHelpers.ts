import { toast } from "react-toastify";
import { imageUploadHandler } from "../../../../screens/modules/crm/shared/utils/imageUploadHandler";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import React, { SetStateAction } from "react";

export type FormFilePickerProps = {
  name: string;
  label?: string;
  labelLocation?: SupportedLabelLocations;
  helpText?: React.ReactElement;
  disabled?: boolean;
  isSample?: boolean;
  editMode?: boolean;
  clearFiles?: boolean;
  allowMultiple?: boolean;
  handleClearState?: (value: boolean) => void;
  maxFileSize?: number;
  modelNameToBeUsed?: string;
  addFileNameToField?: boolean;
  setDisabled?: any;
  removedNameValue?: string | null;
};

export function fileOnInput(
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
        serviceName: "crm",
        moduleName: modelName,
        publicUrl: false,
      });
      setFileProcessing(false);
      if (setDisabled) setDisabled(false);
      if (fileId) uploadSingleFile(currentFile, fileId);
      else toast.error("File uploading failed!");
    }
  };
}
