import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { NoDataControl } from "./NoDataControl";
import { get } from "lodash";

export const DetailAutoNumberControl = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  displayType,
  fixedWidth,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "fontColor"
  | "displayType"
  | "fixedWidth"
>) => {
  const dataToDisplay = data[field.value] || get(data, field.value) || "";
  return (
    <p
      className={`whitespace-pre-line ${displayType} ${
        fontSize.value
      } ${fontColor} ${truncateData ? "truncate" : "break-words"} ${
        fixedWidth || ""
      }`}
      title={dataToDisplay}
      data-testid={`${field.label || field.value}-${dataToDisplay || "-"}`}
    >
      {dataToDisplay || <NoDataControl fontSize={fontSize} />}
    </p>
  );
};
