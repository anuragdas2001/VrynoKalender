import React, { useRef } from "react";
import { useFormikContext } from "formik";
import { toast } from "react-toastify";
import { Config, HostNameConstants } from "../../../../shared/constants";
import CameraIcon from "remixicon-react/CameraFillIcon";
import { imageUploadHandler } from "../../../../screens/modules/crm/shared/utils/imageUploadHandler";
import { SecureImage } from "../SecureImage/SecureImage";
import EditIcon from "remixicon-react/PencilLineIcon";
import { ClickOutsideToClose } from "../../shared/ClickOutsideToClose";
import Link from "next/link";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import Button from "../Button/Button";
import { SupportedApps } from "../../../../models/shared";
import base64ToFile from "../../../../screens/modules/crm/shared/utils/base64ToFile";

export type FormImagePickerProps = {
  name: string;
  label?: string;
  labelLocation?: SupportedLabelLocations;
  helpText?: React.ReactElement;
  disabled?: boolean;
  isSample?: boolean;
  sampleImageUrl?: string;
  required?: boolean;
  modelName: string;
  currentFormLayer?: boolean;
  externalExpressionToCalculateValue?: string;
  rejectRequired?: boolean;
  isRounded?: boolean;
  containerWidth?: string | null;
  containerHeight?: string | null;
  showEditOption?: boolean;
  labelSize?: string;
  editPosition?: string;
  itemsCenter?: boolean;
  imageServiceName?: SupportedApps.crm | SupportedApps.accounts;
  compressionWidth?: number;
  resolutionMessage?: string;
};

export type LocalImage = {
  lastModified: number;
  lastModifiedDate?: {};
  name: string;
  size: number;
  type: string;
  webkitRelativePath?: string;
};

export type ThumbnailProps = {
  fileId: string;
  processing: boolean;
  isSample?: boolean;
  sampleImageUrl?: string;
  modelName: string;
  containerWidth?: string | null;
  containerHeight?: string | null;
  imageServiceName?: SupportedApps.crm | SupportedApps.accounts;
};

export const Thumbnail = ({
  fileId,
  processing,
  isSample,
  sampleImageUrl,
  modelName,
  containerWidth = null,
  containerHeight = null,
  imageServiceName = SupportedApps.crm,
}: ThumbnailProps) => {
  return (
    <>
      {!fileId && !processing && isSample && (
        <img src={sampleImageUrl} className="w-full h-full object-cover" />
      )}
      {!fileId && !processing && !isSample && (
        <div className="w-full h-full flex items-center justify-center">
          <CameraIcon size={40} className="text-vryno-icon-gray" />
        </div>
      )}
      {fileId && !processing && (
        <div className="text-center w-full">
          <SecureImage
            url={`${Config.metaPrivateUploadUrl()}${imageServiceName}/${modelName}/${fileId}`}
            alt="profile"
            className={`object-cover ${
              containerWidth ? containerWidth : "w-full"
            } ${containerHeight ? containerHeight : "h-full"}`}
          />
        </div>
      )}
      {!fileId && processing && (
        <span className="text-vryno-icon-gray w-full h-full flex items-center justify-center">
          Loading...
        </span>
      )}
    </>
  );
};

export default function FormImagePicker({
  name,
  label,
  helpText,
  isSample = false,
  disabled = false,
  labelLocation = SupportedLabelLocations.OnTop,
  sampleImageUrl,
  required = false,
  modelName,
  currentFormLayer,
  externalExpressionToCalculateValue,
  rejectRequired,
  isRounded = true,
  containerWidth = null,
  containerHeight = null,
  showEditOption = true,
  labelSize,
  editPosition,
  itemsCenter = false,
  imageServiceName = SupportedApps.crm,
  compressionWidth,
  resolutionMessage,
}: FormImagePickerProps) {
  const { values, touched, setFieldValue, errors, setFieldTouched } =
    useFormikContext<Record<string, any>>();
  const [imageProcessing, setImageProcessing] = React.useState(false);
  const [imageMenuVisible, setImageMenuVisible] = React.useState(false);

  let isValid = touched[name] ? errors[name] === undefined : true;

  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";

  const borderClass =
    isValid || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";

  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, () => setImageMenuVisible(false));

  return (
    <div className={`flex my-2 py-2 items-center justify-center ${divFlexCol}`}>
      {label && (
        <div className="flex flex-col items-center">
          <div
            className={`flex ${
              itemsCenter ? "items-center justify-center" : "items-start"
            } relative ${containerWidth || ""} ${containerHeight || ""}`}
          >
            <label
              htmlFor={`${paramCase(name)}-${currentFormLayer}`}
              className={`border hover:border-blue-200 text-sm tracking-wide text-vryno-label-gray cursor-pointer flex overflow-hidden 
              ${isRounded ? "rounded-full" : ""} ${borderClass}  ${
                containerWidth ? "" : "w-36"
              } ${containerHeight ? "" : "h-36"}`}
            >
              <Thumbnail
                fileId={values[name]}
                processing={imageProcessing}
                isSample={isSample}
                sampleImageUrl={sampleImageUrl}
                modelName={modelName}
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                imageServiceName={imageServiceName}
              />
            </label>
            <div
              className={`rounded-full bg-vryno-theme-light-blue border border-white absolute ${
                editPosition ? editPosition : "right-2.5"
              }`}
            >
              <Button
                id="form-image-picker-edit"
                onClick={() => setImageMenuVisible(true)}
                customStyle=""
                userEventName="image-picker-edit:action-click"
              >
                <EditIcon
                  className={`text-white cursor-pointer ${
                    values[name] ? "p-1" : "hidden"
                  }`}
                  size={25}
                />
              </Button>
              {imageMenuVisible && (
                <div
                  className="origin-top-right -left-6 absolute mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  id="navlinks"
                  ref={wrapperRef}
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  {(showEditOption
                    ? [
                        {
                          name: "Edit",
                          onClick: () => {
                            document
                              .getElementById(
                                `${paramCase(name)}-${currentFormLayer}`
                              )
                              ?.click();
                          },
                        },
                        {
                          name: "Remove",
                          onClick: () => setFieldValue(name, null),
                        },
                      ]
                    : [
                        {
                          name: "Remove",
                          onClick: () => setFieldValue(name, null),
                        },
                      ]
                  ).map((item, index) => (
                    <Link href="" key={index} legacyBehavior>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setImageMenuVisible(false);
                          item.onClick();
                        }}
                        className={`p-2 cursor-pointer flex flex-row items-center rounded-md border-b border-gray-100 hover:bg-vryno-dropdown-hover`}
                      >
                        <span className="text-sm">{item.name}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          <span
            className={`${
              resolutionMessage?.length
                ? "text-gray-400"
                : "text-vryno-icon-gray"
            } pt-2 text-center ${labelSize || ""}`}
          >
            {label}
            {resolutionMessage?.length ? (
              <>
                <br />
                <div className="text-xsm text-vryno-icon-gray">
                  <i>(Note: {resolutionMessage ?? ""})</i>
                </div>
              </>
            ) : (
              <></>
            )}
          </span>
          <RequiredIndicator required={rejectRequired ? false : required} />
        </div>
      )}
      <div className={`relative`}>
        <input
          id={`${paramCase(name)}-${currentFormLayer}`}
          data-testid={paramCase(name)}
          name={name}
          type="file"
          accept="image/*"
          onClick={(event) => (event.currentTarget.value = "")}
          onChange={async (event) => {
            const currentFile =
              event.currentTarget.files && event.currentTarget.files.length
                ? event.currentTarget.files[0]
                : null;
            if (!currentFile) {
              return;
            }
            if (currentFile && !currentFile.type.includes("image")) {
              toast.error("Cannot upload this file type");
              setFieldValue(name, null);
            } else if (currentFile.size > 2097152) {
              toast.error("Max file size can only be 2MB.");
              setFieldValue(name, null);
            } else {
              if (compressionWidth) {
                setImageProcessing(true);
                setFieldValue(name, null);
                const reader = new FileReader();
                reader.readAsDataURL(currentFile);
                reader.onload = async (event) => {
                  try {
                    const imgElement = document.createElement("img");
                    imgElement.src = event.target?.result as string;

                    imgElement.onload = async () => {
                      const canvas = document.createElement("canvas");
                      const MAX_WIDTH = compressionWidth;

                      const scaleSize = MAX_WIDTH / imgElement.width;
                      canvas.width = MAX_WIDTH;
                      canvas.height = imgElement.height * scaleSize;

                      const ctx = canvas.getContext("2d");
                      ctx?.drawImage(
                        imgElement,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                      );
                      const resizedDataUrl = canvas.toDataURL("image/jpeg");
                      const mimeType = currentFile.type;
                      const fileName = currentFile.name;
                      const file = base64ToFile(
                        resizedDataUrl,
                        mimeType,
                        fileName
                      );

                      const fileId = await imageUploadHandler({
                        image: file,
                        serviceName: imageServiceName,
                        moduleName: modelName,
                        publicUrl: false,
                        params: undefined,
                      });

                      setImageProcessing(false);
                      if (fileId) setFieldValue(name, fileId);
                      else toast.error("File uploading failed!");
                    };
                  } catch (err) {
                    setImageProcessing(false);
                    console.error("Error processing image:", err);
                    toast.error("Failed to process image");
                  }
                };
              } else {
                setImageProcessing(true);
                setFieldValue(name, null);
                const fileId = await imageUploadHandler({
                  image: currentFile,
                  serviceName: imageServiceName,
                  moduleName: modelName,
                  publicUrl: false,
                  params: undefined,
                  // params:
                  //   imageServiceName == SupportedApps.accounts
                  //     ? {
                  //         apiSubDomain: HostNameConstants().apiSubDomain,
                  //         apiHostName: HostNameConstants().apiHostName,
                  //       }
                  //     : undefined,
                });
                setImageProcessing(false);
                if (fileId) setFieldValue(name, fileId);
                else toast.error("File uploading failed!");
              }
            }
          }}
          disabled={disabled}
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
