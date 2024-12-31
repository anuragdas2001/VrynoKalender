import { SecureImage } from "../../../../../../components/TailwindControls/Form/SecureImage/SecureImage";
import { Config } from "../../../../../../shared/constants";
import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";

export const DetailImageControl = ({
  data,
  field,
  modelName,
}: Pick<DetailFieldPerDataTypeProps, "data" | "field" | "modelName">) => (
  <div
    className="w-20 h-20 border-4 rounded-full  text-sm tracking-wide text-vryno-label-gray cursor-pointer flex items-center justify-center overflow-hidden"
    data-testid={`${field.label}-value`}
  >
    {data[field.value] ? (
      <SecureImage
        url={`${Config.metaPrivateUploadUrl()}crm/${modelName}/${
          data[field.value]
        }`}
        alt="profile"
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
