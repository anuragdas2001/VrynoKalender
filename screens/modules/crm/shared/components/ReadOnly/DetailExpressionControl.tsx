import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { NoDataControl } from "./NoDataControl";
import { get } from "lodash";
import { getPrecisedValueBack } from "../../../../../../components/TailwindControls/Form/InputBox/InputBox";

export const DetailExpressionControl = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  viewType = "Card",
  displayType,
  fixedWidth,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "fontColor"
  | "viewType"
  | "displayType"
  | "fixedWidth"
>) => {
  const findIndexOfDecimal = Number(String(data[field.value])?.indexOf("."));
  const precision = get(field.field?.dataTypeMetadata?.format, "precision", 0);

  const dataToDisplay =
    typeof data[field.value] === "number"
      ? getPrecisedValueBack(
          Number(data[field.value]),
          precision,
          findIndexOfDecimal
        )
      : data[field.value]
      ? data[field.value]
      : "";

  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        viewType === "List" || truncateData
          ? "truncate"
          : "break-all whitespace-pre-line"
      } ${fixedWidth || ""}`}
      title={dataToDisplay}
      data-testid={`${field.label || field.value}-${dataToDisplay || "-"}`}
    >
      {dataToDisplay || <NoDataControl fontSize={fontSize} />}
    </p>
  );
};
