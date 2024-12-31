import React, { useState } from "react";
import { useFormikContext } from "formik";
import { toast } from "react-toastify";
import { PageIcons } from "../../VrynoIcon";
import Dropzone from "react-dropzone";
import { X } from "react-feather";
import UploadFileIcon from "remixicon-react/UploadCloudLineIcon";
import Button from "../Button/Button";

export default function FormFileDropper({
  name,
  disabled,
  files,
  onChange = () => {},
  ...props
}: {
  name: string;
  disabled?: boolean;
  files?: File[] | null;
  onChange?: (file: File[] | null) => void;
}) {
  const { setFieldValue, errors } = useFormikContext<Record<string, any>>();
  const [fileUpload, setFileUpload] = useState<File[]>([]);

  const onInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    //@ts-ignore
    event.target.value = "";
  };

  function uploadSingleFile(acceptedFiles: File[]) {
    if (
      acceptedFiles[0] &&
      !["application/vnd.ms-excel", "text/csv"].includes(acceptedFiles[0].type)
    ) {
      toast.error("This file type cannot be uploaded.");
      setFieldValue(name, null);
      onChange(null);
    } else if (acceptedFiles[0] && acceptedFiles[0].size > 26214400) {
      toast.error("Max file size can only be 25MB.");
      setFieldValue(name, null);
      onChange(null);
    } else {
      setFileUpload([acceptedFiles[0]]);
      setFieldValue(name, [acceptedFiles[0]]);
      onChange([acceptedFiles[0]]);
    }
  }

  function deleteFile(idx: number) {
    const s = fileUpload.filter((item, index) => index !== idx);
    setFileUpload(s);
    setFieldValue(name, [...s]);
    onChange([...s]);
  }

  React.useEffect(() => {
    if (files && files.length > 0) {
      let updatedList = [...fileUpload];
      for (let index = 0; index < files.length; index++) {
        const foundAt = updatedList.findIndex(
          (file) => file.name === files[index].name
        );
        if (foundAt === -1) {
          updatedList.push(files[index]);
        }
      }
      setFileUpload(updatedList);
      setFieldValue(name, [...updatedList]);
    }
  }, [files]);

  return (
    <>
      <Dropzone onDrop={uploadSingleFile} disabled={disabled}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps({
              className:
                "w-full mt-5 p-3 h-44 cursor-pointer rounded-lg border border-vryno-form-border-gray  flex flex-col items-center focus:shadow-md",
            })}
          >
            <input {...getInputProps()} onClick={onInputClick} />
            {fileUpload.length > 0 &&
              fileUpload.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="w-full grid grid-cols-12 bg-gray-300 bg-opacity-30 rounded-md p-2"
                  >
                    <span className="col-span-11 truncate text-sm">
                      {item.name}
                    </span>
                    {!disabled && (
                      <Button
                        id="file-dropper-remove-file"
                        onClick={() => deleteFile(index)}
                        customStyle="col-span-1 flex justify-end"
                        userEventName="file-dropper-remove-file:action-click"
                      >
                        {PageIcons(X, 24, "cursor-pointer text-black")}
                      </Button>
                    )}
                  </div>
                );
              })}
            <div className="w-full h-full flex flex-col justify-center text-sm items-center gap-y-4">
              <span className="text-gray-500">
                Drag & Drop file, or click to upload data
              </span>
              <div>
                <Button
                  id="file-dropper-download-sample-data"
                  disabled={disabled}
                  customStyle={`py-3.5 px-4 mx-auto w-full text-sm rounded-md flex justify-center ${
                    disabled
                      ? "bg-vryno-theme-blue-disable"
                      : "bg-vryno-theme-blue"
                  }`}
                  userEventName="file-dropper-download-sample-data-click"
                >
                  <span className="flex text-white">
                    <UploadFileIcon className="text-white mr-2" />
                    {fileUpload.length ? "Upload New File" : "Select File"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
      {errors[name] && (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          <>{errors[name]}</>
        </label>
      )}
    </>
  );
}
