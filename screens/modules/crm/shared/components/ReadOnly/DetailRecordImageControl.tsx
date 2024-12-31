import { SecureImage } from "../../../../../../components/TailwindControls/Form/SecureImage/SecureImage";
import { Config, HostNameConstants } from "../../../../../../shared/constants";
import generateHash from "../../utils/generateHash";
import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { SupportedApps } from "../../../../../../models/shared";

const generateUrlDomain = function (
  imageServiceName: string | undefined,
  imageServiceSubdomain: string | undefined
) {
  return Config.metaPrivateUploadUrl(
    imageServiceName == SupportedApps.accounts
      ? {
          apiSubDomain:
            imageServiceSubdomain || HostNameConstants().apiSubDomain,
          apiHostName: HostNameConstants().apiHostName,
        }
      : imageServiceSubdomain
      ? {
          apiSubDomain: `${imageServiceSubdomain}.${
            HostNameConstants().apiSubDomain
          }`,
        }
      : undefined
  );
};

export const DetailRecordImageControl = ({
  field,
  data,
  onDetail,
  modelName,
  isSample,
  from,
  imageSize,
  customOpacity,
  imageServiceName = SupportedApps.crm,
  imageServiceModelName,
  imageServiceSubdomain,
}: Pick<
  DetailFieldPerDataTypeProps,
  "field" | "data" | "isSample" | "customOpacity" | "imageServiceName"
> & {
  onDetail: boolean;
  modelName?: string;
  from?: string;
  imageSize?: string;
  imageServiceModelName?: string;
  imageServiceSubdomain?: string;
}) => {
  return (
    <div
      className={`text-sm tracking-wide text-vryno-label-gray cursor-pointer flex items-center justify-center overflow-hidden ${
        imageSize
          ? imageSize
          : from === "notes"
          ? "w-11/12 mt-1"
          : onDetail
          ? "w-36 h-36"
          : from === "table"
          ? "w-10 h-10"
          : "w-16 h-16"
      } ${from !== "notes" && "border-2 rounded-full"} ${customOpacity || ""}`}
      data-testid={`${field.label || field.value}-value`}
    >
      {data[field.value] ? (
        <SecureImage
          url={`${generateUrlDomain(
            imageServiceName,
            imageServiceSubdomain
          )}${imageServiceName}/${imageServiceModelName || modelName}/${
            data[field.value]
          }`}
          alt="profile"
          className="w-full h-full object-cover"
        />
      ) : from && from === "notes" ? (
        <SecureImage
          url={`${generateUrlDomain(
            imageServiceName,
            imageServiceSubdomain
          )}${imageServiceName}/${imageServiceModelName || modelName}/${data}`}
          alt={from}
          className="w-full h-full object-cover"
        />
      ) : isSample ? (
        <img
          src={`/sample/${modelName}/${generateHash(data.id)}.jpg`}
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={`/vryno_icon.svg`}
          className="ml-[2px] mt-2 w-[60%] h-full bg-cover opacity-90"
        />
      )}
    </div>
  );
};
